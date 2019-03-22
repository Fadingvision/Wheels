import * as net from 'net';
import { EventEmitter } from 'events';

export enum State {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export enum Stage {
  HEAD,
  PAYLOAD_LENGTH_16,
  PAYLOAD_LENGTH_64,
  MASK,
  DATA,
  COMPLETE,
}

export default class WsClient extends EventEmitter {
  public state: State = State.CONNECTING;
  private socket: net.Socket;
  private buffers: Buffer[] = [];
  private bufferBytes: number = 0;
  private stage: Stage = Stage.HEAD;

  private isFin: boolean = false;
  private opcode: number = 0;
  private fragmentOpCode: number = 0;
  private payloadLength: number = 0;
  private isMask: boolean = true;
  private fragments: Buffer[] = [];

  constructor(socket: net.Socket) {
    super();
    this.socket = socket;
    // handleData
    socket.on('data', (chunk) => {
      this.buffers.push(chunk);
      // received bytes of buffer
      this.bufferBytes += chunk.length;
      this.decodeFrame();
    });

    this.state = State.OPEN;
  }

  public send(data: string | object): void {}

  private consume(bytes: number): Buffer {
    if (bytes > this.bufferBytes) {
      throw new Error('read buffer over maximum size');
    }

    this.bufferBytes -= bytes;

    if (bytes === this.buffers[0].length) {
      return this.buffers.shift();
    }

    if (bytes < this.buffers[0].length) {
      const buf = this.buffers[0];
      this.buffers[0] = buf.slice(bytes);
      return buf.slice(0, bytes);
    }

    const distBuffer: Buffer = Buffer.allocUnsafe(bytes);

    while (bytes > 0) {
      const buf = this.buffers[0];
      if (bytes >= buf.length) {
        this.buffers.shift().copy(distBuffer, distBuffer.length - bytes);
      } else {
        buf.copy(distBuffer, distBuffer.length - bytes, 0, bytes);
        this.buffers[0] = buf.slice(bytes);
        break;
      }

      bytes -= buf.length;
    }

    return distBuffer;
  }

  private decodeFrame(): void {
    this.isFin = false;
    let maskingKey: Buffer;

    if (this.stage === Stage.HEAD) {
      // read first two bytes of buffers
      // which includes fin(1), RSV1-3(3), opcode(4), isMask(1), payload length(7)
      const buf = this.consume(2);

      const [firstByte, secondByte] = buf;
      this.isFin = Boolean(firstByte & 0x80); // 10000000
      let rsv1 = Boolean(firstByte & 0x40); // 01000000
      let rsv2 = Boolean(firstByte & 0x20); // 00100000
      let rsv3 = Boolean(firstByte & 0x10); // 00010000
      this.isMask = Boolean(secondByte & 0x80); // 10000000

      this.opcode = firstByte & 0x0F; // 00001111
      this.payloadLength = secondByte & 0x0F; // 01111111

      if (rsv1 || rsv2 || rsv3) {
        return this.abortConnection('RSV bit are not be supported');
      }

      if (!this.isMask) {
        return this.abortConnection('the client\'s message must be masked');
      }

      // if it's the first fragment, save the opcode for the upcoming fragments
      if (!this.isFin && this.opcode !== 0x00 && this.opcode < 0x07) {
        this.fragmentOpCode = this.opcode;
      }

      // for the later fragments, wo need to correct the opcode
      if (this.opcode === 0x00) {
        this.opcode = this.fragmentOpCode;
      }

      if (this.payloadLength === 126) {
        this.stage = Stage.PAYLOAD_LENGTH_16;
      } else if (this.payloadLength === 127) {
        this.stage = Stage.PAYLOAD_LENGTH_64;
      } else {
        this.stage = Stage.MASK;
      }
    }

    if (this.stage === Stage.PAYLOAD_LENGTH_16) {
      // bytes with payload length
      // 从当前位0开始读16位的一个无符号整型
      this.payloadLength = this.consume(2).readUInt16BE(0);
      this.stage = Stage.MASK;
    }

    if (this.stage === Stage.PAYLOAD_LENGTH_64) {
      const buf = this.consume(8);
      const fisrtFourBtyesNum = buf.readUInt32BE(0);
      const secondFourBtyesNum = buf.readUInt32BE(4);
      this.stage = Stage.MASK;

      this.payloadLength = fisrtFourBtyesNum * Math.pow(2, 32) + secondFourBtyesNum;
    }

    if (this.stage === Stage.MASK) {
      if (this.isMask) {
        maskingKey = this.consume(4);
        this.stage = Stage.DATA;
      }
    }

    if (this.stage === Stage.DATA) {
      let data = Buffer.alloc(0);
      if (this.payloadLength && this.bufferBytes < this.payloadLength) {
        return;
      }
      data = this.consume(this.payloadLength);

      if (this.isMask) {
        unmask(data, maskingKey);
      }

      // control frames, wo handle it separately
      if (this.opcode > 0x07) {
        return this.controlMessage(data);
      }

      // message frames
      if (data.length) {
        this.fragments.push(data);
      }
    }

    this.processData();

    // keep decoding
    if (this.bufferBytes > 0) {
      process.nextTick(this.decodeFrame.bind(this));
    }
  }

  private processData(): void {
    // means it's the last frame,
    // otherwise we'll wait for more fragments to come
    if (this.isFin) {
      let data;
      const fragments = this.fragments;
      // reset flags
      this.fragmentOpCode = 0;
      this.fragments = [];

      const messageBuffer = concat(fragments);
        // text message
      if (this.opcode === 0x01) {
        this.emit('message', messageBuffer.toString())
        // binary message
      } else {
        this.emit('message', messageBuffer);
      }
    }
  }

  private controlMessage(data: Buffer): void {
    switch(this.opcode) {
      // close singal
      case 0x08: {

      }
      // ping
      case 0x09: {

      }
      // pong
      case 0x0A: {

      }
      default: 
        break;
    }
  }

  private abortConnection(err: string) {
    this.emit('error', err);
    this.socket.end();
    this.socket.destroy();
  }
}


function unmask(data: Buffer, maskingKey: Buffer): void {
  const bufferLength = data.length;
  for (var i = 0; i < bufferLength; i++) {
    data[i] = data[i] ^ maskingKey[i % 4];
  }
}

function concat(buffers: Buffer[]) {
  const length = buffers.reduce((len: number, buffer: Buffer) => {
    len += buffer.length;
    return len;
  }, 0);

  return Buffer.concat(buffers, length);
}