import * as net from 'net';

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

export default class WsClient {
  public state: State = State.CONNECTING;
  private socket: net.Socket;
  private buffers: Buffer[] = [];
  private bufferBytes: number = 0;
  private stage: Stage = Stage.HEAD;

  constructor(socket: net.Socket) {
    this.socket = socket;
    // handleData
    socket.on('data', (chunk) => {
      this.buffers.push(chunk);
      // received bytes of buffer
      this.bufferBytes += chunk.length;
      this.processData();
    });

    this.state = State.OPEN;
  }

  public send(data: string | object): void {}

  private consume(bytes: number): Buffer {
    this.bufferBytes -= bytes;

    if (bytes === this.buffers[0].length) {
      return this.buffers.shift();
    }

    if (bytes < this.buffers[0].length) {
      const buf = this.buffers[0];
      this.buffers[0] = buf.slice(0, bytes);
      return buf.slice(0, bytes);
    }

    const distBuffer: Buffer = Buffer.allocUnsafe(bytes);

    while (bytes > 0) {
      if (bytes >= this.buffers[0].length) {
        this.buffers.shift().copy(distBuffer, distBuffer.length - bytes);
      } else {
        this.buffers[0].copy(distBuffer, distBuffer.length - bytes, 0, bytes);
        this.buffers[0] = this.buffers[0].slice(bytes);
        break;
      }

      bytes -= this.buffers[0].length;
    }

    return distBuffer;
  }

  private processData() {
    let isFin: boolean = false;
    let opcode: number;
    let isMask: boolean;

    if (this.stage === Stage.HEAD) {
      // read first two bytes of buffers
      // which includes fin, RSV1-3, isMask, payloadlength  
      const buf = this.consume(2);
    }

    if (this.stage === Stage.PAYLOAD_LENGTH_16) {

    }

    if (this.stage === Stage.PAYLOAD_LENGTH_64) {

    }

    if (this.stage === Stage.MASK) {

    }

    if (this.stage === Stage.DATA) {

    }
  }

  private abortConnection(err: string) {
    this.socket.end(err);
    this.socket.destroy();
  }
}