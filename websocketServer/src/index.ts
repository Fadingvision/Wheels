// only use (import = require) with (export=) syntax
// import EventEmitter = require('events');
// import http = require('http');

import * as crypto from 'crypto';
import * as EventEmitter from 'events';
import * as http from 'http';
import * as net from 'net';
import * as os from 'os';
import WsClient from './client';

interface Ioptions {
  port: number;
}

const MAGIC_STRING: string = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function createSecAccept(secWebsocketKey: string): string {
  return crypto.createHash('sha1')
    .update(secWebsocketKey + MAGIC_STRING)
    .digest('base64');
}

export default class WebSocketServer extends EventEmitter {
  public opts: Ioptions;
  public clients: Set<WsClient>;
  public server: http.Server;

  constructor(opts: Ioptions) {
    super();
    this.opts = opts;
    this.clients = new Set();
    this.server = http.createServer();

    this.server.on('upgrade', (req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
      this.handleUpgrade(req, socket);
    });

    this.server.listen(opts.port);
  }

  /**
   * handle Upgrade requests on http channel
   * @param req
   * @param socket
   */
  private handleUpgrade(req: http.IncomingMessage, socket: net.Socket): void {
    const key = req.headers['sec-websocket-key'] as string;
    if (req.headers.upgrade !== 'websocket' ||
      !key
    ) {
      this.abortHandshake(socket, 400);
      return;
    }
    this.completeUpgrade(key, socket);
  }

  private completeUpgrade(key: string, socket: net.Socket) {
    const secWebSocketAccept = createSecAccept(key);

    // response haders
    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${secWebSocketAccept}`,
    ];

    socket.write([...headers, os.EOL].join(os.EOL));

    // tracking clients
    const client = new WsClient(socket);
    this.clients.add(client);
    socket.on('close', () => {
      this.clients.delete(client);
    });

    this.emit('connection', client);
  }

  private abortHandshake(socket: net.Socket, code: number, message?: string, headers?: http.OutgoingHttpHeaders) {
    if (socket.writable) {
      message = message || http.STATUS_CODES[code];
      headers = Object.assign({
        'Connection': 'close',
        'Content-type': 'text/html',
        'Content-length': Buffer.byteLength(message),
      }, headers);
    }

    socket.end(
      // A start-line describing the requests to be implemented
      // or its status of whether successful or a failure. this
      // start-line is always a single-line
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}${os.EOL}` + 
      // An optional set of http Headers specifying the response
      Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join(os.EOL) +
      // an extra blank line indicating all meta-information up above for the response have been sent
      os.EOL.repeat(2) +
      // An optional body containing data associated with the response
      message,
    );

    socket.destroy();
  }
}
