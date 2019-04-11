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

type Bit = 0 | 1;

interface IsendOptions {
  fin?: boolean;
  mask?: boolean;
  binary?: boolean;
  opcode?: number;
}

const MAXIMUM_TWO_BYTES_NUMBER = 65535;

function getBit(number: number, bitPosition: number): boolean {
  return Boolean((number >> bitPosition) & 1);
}

function updateBit(number: number, bitPosition: number, bitValue: Bit) {
  // Normalized bit value.
  const bitValueNormalized = bitValue ? 1 : 0;

  // Init clear mask.
  const clearMask = ~(1 << bitPosition);

  // Clear bit value and then set it up to required value.
  return (number & clearMask) | (bitValueNormalized << bitPosition);
}

export default class WsClient extends EventEmitter {
  
  static toBuffer(data: any) {
    if (Buffer.isBuffer(data)) return data;
    return Buffer.from(data);
  }

  static unmask(data: Buffer, maskingKey: Buffer): void {
    const bufferLength = data.length;
    for (var i = 0; i < bufferLength; i++) {
      data[i] = data[i] ^ maskingKey[i % 4];
    }
  }


  public state: State = State.CONNECTING;
  public socket: net.Socket;

  // close
  private closeCode: number;
  private closeReason: string;
  
  // Send 
  private isFirstFragment: boolean = true;
  private isCloseFrameSent: boolean = false;
  // Receive
  private isCloseFrameReceived: boolean = false;
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

    socket.on('close', this.onSocketClose.bind(this));
    socket.on('error', (err: Error) => {
      this.emit('error', err);
    });
    // socket.on("end", this.onSocketClose.bind(this));

    this.state = State.OPEN;
  }

  public send(data: string | Buffer, options?: IsendOptions, callback?: Function): void {
    const buffer = Buffer.allocUnsafe(0);
    const isBuffer = Buffer.isBuffer(data);
    let frameBytes = 2; // contains first two bytes
    const buf = WsClient.toBuffer(data);
    options = Object.assign({
      fin: true,
      mask: false,
      binary: typeof data !== 'string'
    }, options);

    let opcode = options.binary ? 0x02 : 0x01;

    this.isFirstFragment = Boolean(options.fin);

    if (this.isFirstFragment) {
      if (!options.fin) this.isFirstFragment = false;
    } else {
      // indicates it's continuate frame
      opcode = 0x00;
      // since it's the last frame, we reset first flag
      if (options.fin) this.isFirstFragment = true;
    }

    options.opcode = typeof options.opcode !== 'undefined' ? options.opcode : opcode;

    let payloadLength = buf.length;
    let extendPayloadByteLength = 0;

    if (payloadLength > 125) {
      payloadLength =
        payloadLength > MAXIMUM_TWO_BYTES_NUMBER ? 127 : 126;
      extendPayloadByteLength = payloadLength > MAXIMUM_TWO_BYTES_NUMBER ? 8 : 2;
    }

    frameBytes += extendPayloadByteLength;

    const message = Buffer.allocUnsafe(frameBytes + buf.length);
    // fill the buffer with info
    message[0] = options.fin ? (options.opcode | 0x80) : options.opcode;
    message[1] = payloadLength;

    if (payloadLength === 126) {
      message.writeUInt16BE(buf.length, 2);
    } else if (payloadLength === 127) {
      message.writeUInt16BE(0, 2);
      message.writeUInt16BE(buf.length, 6);
    }

    buf.copy(message, frameBytes);

    this.socket.write(message, err => {
      if (err) {
        this.emit('err', err);
      } else {
        callback && callback();
      }
    });
  }

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
      this.opcode = firstByte & 0x0F; // 00001111
      
      this.isMask = Boolean(secondByte & 0x80); // 10000000
      this.payloadLength = secondByte & 0x0F; // 01111111

      if (rsv1 || rsv2 || rsv3) {
        return this.handleError('RSV bit are not be supported');
      }

      if (!this.isMask) {
        return this.handleError('the client\'s message must be masked');
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
      }
      this.stage = Stage.DATA;
    }

    if (this.stage === Stage.DATA) {
      let data = Buffer.alloc(0);
      if (this.payloadLength && this.bufferBytes < this.payloadLength) {
        return;
      }
      data = this.consume(this.payloadLength);

      if (this.isMask) {
        WsClient.unmask(data, maskingKey);
      }

      // control frames, wo handle it separately
      if (this.opcode > 0x07) {
        return this.handleControlFrames(data);
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

    // reset state
    this.stage = Stage.HEAD;
  }

  public close(code: number = 1000, reason: string = '') {
    if (this.state === State.CLOSED) return;

    if (this.state === State.CLOSING) {
      if (this.isCloseFrameReceived && this.isCloseFrameSent) {
        this.socket.destroy();
      }
      return;
    }

    this.state = State.CLOSING;

    const buf = Buffer.allocUnsafe(2 + Buffer.byteLength(reason));
    buf.writeUInt16BE(code, 0);
    if (reason) buf.write(reason, 2, 'utf-8');

    this.send(buf, {
      fin: true,
      opcode: 0x08,
      mask: false
    }, () => {
      this.isCloseFrameSent = true;
      if (this.isCloseFrameReceived) {
        this.socket.destroy();
      }
    })
  }
  
  public ping(data: any) {
    if (this.state !== State.OPEN) {
      this.emit('error', 'An endpoint Can only send a Ping frame after the connection is established and before the connection is closed.')
      return;
    }
    const buf = WsClient.toBuffer(data);
    this.send(buf, { opcode: 0x09 });
  }

  public pong(data: any) {
    console.log(this.state)
    if (this.state !== State.OPEN) {
      this.emit('error', 'An endpoint Can only send a Pong frame after the connection is established and before the connection is closed.')
      return;
    }

    const buf = WsClient.toBuffer(data);
    this.send(buf, { opcode: 0xA });
  }

  private handleControlFrames(data: Buffer): void {
    switch(this.opcode) {
      // close singal
      case 0x08: {
        this.isCloseFrameReceived = true;

        if (data.length === 0) {
          this.closeCode = 1005;
          this.closeReason = '';
        } else {
          this.closeCode = data.readUInt16BE(0);
          this.closeReason = data.slice(2).toString();
        }
        this.close();
      };
      // ping
      case 0x09: {
        this.emit('ping', data);
        // send pong frame back as soon as possible
        this.pong(data);
      };
      // pong
      case 0x0A: {
        this.emit('pong', data);
      }
      default:
        break;
    }

    // reset state
    this.stage = Stage.HEAD;
  }

  private handleError(err: string) {
    this.emit('error', err);
    this.socket.destroy();
  }

  private onSocketClose() {
    this.state = State.CLOSED;
    this.emit('close', this.closeCode, this.closeReason);
    this.socket.removeAllListeners();
    this.removeAllListeners();
  }
}

function concat(buffers: Buffer[]) {
  const length = buffers.reduce((len: number, buffer: Buffer) => {
    len += buffer.length;
    return len;
  }, 0);

  return Buffer.concat(buffers, length);
}