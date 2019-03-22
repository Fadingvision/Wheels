import WsClient from '../src/client';
import WebSocketServer from '../src/index';

const wss = new WebSocketServer({
  port: 8888,
});

wss.on('connection', function connection(ws: WsClient) {
  ws.on('message', function incoming(message: string) {
    // Broadcast to everyone else.
    console.log(message);
  });
  // ws.send('something');
});
