import WebSocketServer from '../src/index';

const wss: WebSocketServer = new WebSocketServer({
  port: 8888,
});

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     // Broadcast to everyone else.
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send('Broadcast to everyone else.');
//       }
//     });
//   });

//   ws.send('something');
// });
