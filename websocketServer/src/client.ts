import * as net from 'net';

export enum State {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export default class WsClient {
  public state: State;
  private buffers: Buffer[];
  private bufferBytes: number;

  constructor(socket: net.Socket) {
    this.state = State.CONNECTING;
    this.buffers = [];
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

  private processData() {

  }
}