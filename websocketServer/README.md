## 前置知识 

- [webSocket 协议](https://tools.ietf.org/html/rfc6455#section-5.4)
- [Bit Manipulation](https://hackernoon.com/programming-with-js-bitwise-operations-393eb0745dc4)
- http
- net
- Stream
- Events
- Buffer
- crypto

## WebSocket服务器应该完成的工作

### 响应websocket握手

websocket 是一个独立的基于TCP/IP的应用层协议，但是会利用HTTP来建立TCP/IP通道，并响应`Upgrade`请求。

nodejs 已经自带了upgrade事件，用于响应`Upgrade`请求。

从IncomingMessage中取出我们需要的header, 用于验证该条请求是否是合乎websocket标准的, 如果该条请求不是标准的，需要abort这条请求。

一个标准的`Upgrade`请求：

```
GET /echo HTTP/1.1
Host: echo.rafalgolarz.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBbZSGub13jZQ==
Sec-WebSocket-Version: 13
```

为了向客户端证明该条握手请求已经被正确接收了，我们需要返回对应的响应头。

```
'HTTP/1.1 101 Switching Protocols',
'Upgrade: websocket',
'Connection: Upgrade',
`Sec-WebSocket-Accept: ${secWebSocketAccept}`,
```

其中最主要的是Sec-WebSocket-Accept, 它的值的计算方式：

连接secWebsocketKey和固定的字符串`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`,将其进行sha1 hash编码，然后返回该hash的base64编码的字符串。

此时响应完成，代表握手完成，可以开始进行数据的传输交换。

```ts
const MAGIC_STRING: string = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
function createSecAccept(secWebsocketKey: string): string {
  return crypto.createHash('sha1')
    .update(secWebsocketKey + MAGIC_STRING)
    .digest('base64');
}

this.server.on('upgrade', (req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
  this.handleUpgrade(req, socket);
});


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

  // 握手完成后，用socket套接字针对每个客户端实例化一个实例，用于追踪客户端
  // 同时触发connection事件，告诉使用者可以使用client实例来进行数据的传输
  const client: WsClient = new WsClient(socket);
  this.clients.add(client);
  client.on('close', () => {
    this.clients.delete(client);
  });
  this.emit('connection', client);
}

```

### 能够接受和发送消息（解码帧）

所有的数据都是二进制格式发送，将所有接收到的数据存入一个Buffer[], 并保存其字节数。

```ts
// 为每条连接定义一个连接状态
export enum State {
  CONNECTING, // 建立握手连接中
  OPEN, // 连接有效中，所有的数据传输都必须基于这个状态
  CLOSING, // 关闭连接中
  CLOSED, // 连接已经关闭
}

// 定义每次解码的解码位置
export enum Stage {
  HEAD,
  PAYLOAD_LENGTH_16,
  PAYLOAD_LENGTH_64,
  MASK,
  DATA,
  COMPLETE,
}


class Client {
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
}

socket.on('data', (chunk) => {
  this.buffers.push(chunk);
  // received bytes of buffer
  this.bufferBytes += chunk.length;
  this.decodeFrame();
});
```

每次接收到数据帧的时候，进行数据帧的解码。

一条数据帧的格式：

![](http://rafalgolarz.com/img/posts/websocket_frame.png)

定义一个函数从buffer数组中消费指定字节长度的二进制数据：

```ts
private consume(bytes: number): Buffer {
  if (bytes > this.bufferBytes) {
    throw new Error('read buffer over maximum size');
  }

  this.bufferBytes -= bytes;
  // 字节数刚好等于第一条数据的长度
  if (bytes === this.buffers[0].length) {
    return this.buffers.shift();
  }

  // 字节数小于第一条数据的长度
  if (bytes < this.buffers[0].length) {
    const buf = this.buffers[0];
    this.buffers[0] = buf.slice(bytes);
    return buf.slice(0, bytes);
  }

  const distBuffer: Buffer = Buffer.allocUnsafe(bytes);

  // 循环使用上面两种情况，直到所需字节为0
  while (bytes > 0) {
    const buf = this.buffers[0];
    // 所需字节数大于第一条数据的长度，将其copy到distBuffer中
    if (bytes >= buf.length) {
      this.buffers.shift().copy(distBuffer, distBuffer.length - bytes);
    } else {
      // 所需字节数小于第一条数据的长度，将bytes长度的数据copy到distBuffer中
      buf.copy(distBuffer, distBuffer.length - bytes, 0, bytes);
      // 将剩余字节赋值给第一条数据
      this.buffers[0] = buf.slice(bytes);
      break;
    }

    bytes -= buf.length;
  }

  // 所需字节的数据
  return distBuffer;
}
```

将解码数据分为五个阶段：

1. HEAD: 读取两个字节(16位), 包含了以下信息：

fin: 1 bit，如果是 1，表示这是消息（message）的最后一个分片（fragment），如果是 0，表示不是是消息（message）的最后一个分片（fragment）。

rsv1, rsv2, rsv3: 保留位，各占 1 个比特, 一般情况下全为 0。当客户端、服务端协商采用 WebSocket 扩展时，这三个标志位可以非 0，且值的含义由扩展进行定义。如果出现非零的值，且并没有采用 WebSocket 扩展，连接出错。

Opcode: 4 bit, 操作代码，Opcode 的值决定了应该如何解析后续的数据载荷, 如果操作代码是不认识的，那么接收端应该断开连接。

- 0x0：表示一个延续帧。当 Opcode 为 0 时，表示本次数据传输采用了数据分片，当前收到的数据帧为其中一个数据分片, 此时的消息格式应该从之前的帧去获取。
- 0x1：表示这是一个文本帧（frame）
- 0x2：表示这是一个二进制帧（frame）
- 0x3-7：保留的操作代码，用于后续定义的非控制帧。
- 0x8：表示连接断开。
- 0x8：表示这是一个 ping 操作。
- 0xA：表示这是一个 pong 操作。
- 0xB-F：保留的操作代码，用于后续定义的控制帧。

mask: 1bit, 表示是否对数据载荷进行了掩码。从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作。如果 Mask 是 1，那么在 Masking-key 中会定义一个掩码键（masking key），并用这个掩码键来对数据载荷进行反掩码。所有客户端发送到服务端的数据帧，Mask 都是 1。

Payload length：7 bit 要读取有效负载数据，您必须知道何时停止读取。这就是为什么数据的长度很重要。其7 bit解析为无符号整型。如果长度小于等于125，那么就是长度; 如果是126，到PAYLOAD_LENGTH_16。读取下面的16位，并将其解释为无符号整型。如果是127，到PAYLOAD_LENGTH_64。
读取接下来的64位，并将其解释为无符号整型

2. PAYLOAD_LENGTH_16: 
3. PAYLOAD_LENGTH_64: 
4. MASK: 
5. DATA: 
6. COMPLETE:

```ts
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
```










































### 追踪连接的各个客户端

### 解码控制帧，并作出对应的响应，包括ping, pong, close等信号

### 能够主动发起关闭连接，或者响应关闭连接消息

### 能够在发生错误的时候关闭连接，并返回对应的错误码。

### 继续支持子协议和扩展

## Reference

https://hackernoon.com/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8

![](http://rafalgolarz.com/img/posts/websocket_frame.png)

https://infoq.cn/article/deep-in-websocket-protocol

https://www.ably.io/concepts/websockets

https://rafalgolarz.com/blog/2016/12/07/writing_websocket_servers_1_of_2/

https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side

https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#%E4%BA%A4%E6%8D%A2%E6%95%B0%E6%8D%AE%E5%B8%A7

https://tools.ietf.org/html/rfc6455#section-5.4


