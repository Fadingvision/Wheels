// import * as socketIO from "socket.io";

// function socketServer() {
  // const wsServer = socketIO();
  // wsServer.listen(9001);
  // wsServer.on("connection", clientSocket => {
  //   clientSocket.on("PING", msg => {
  //     // console.log('Received PING from ', clientSocket.handshake.headers);
  //     let now = new Date();
  //     // PONG is the event name
  //     clientSocket.emit("PONG", `PONG ${new Date()}`);
  //   });
  // }); //end of on Client connection event
// }
// socketServer();


import WsClient from '../src/client';
import WebSocketServer from '../src/index';

// import * as webSocket from "ws";
// const WebSocketServer = webSocket.Server;

const wss = new WebSocketServer({
  port: 8888
});

interface IMessage {
  a: string;
}

wss.on('connection', function connection(ws: WsClient) {
  ws.on('message', function incoming(message: string) {
    // Broadcast to everyone else.
    console.log(message);
  });
  setTimeout(() => {
    ws.send("Hello Client!");
  }, 3000);
});
