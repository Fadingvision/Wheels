import * as net from 'net';

export enum State {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export default class WsClient {
  public state: State;

  constructor(socket: net.Socket) {
    this.state = State.CONNECTING;
  }

  public send(data: string | object) {}
}