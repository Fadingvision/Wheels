# 如何编写一个websocket服务器(Nodejs)

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

### 能够接受消息（解码帧）

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

为了得到二进制数据中的某个位的值是0还是1，我们可以通过将其与特殊的位数据进行`按位与`操作。
对每对比特位执行与（AND）操作。只有 a 和 b 都是 1 时，a AND b 才是 1。

需要注意的是，每当接收到一个连续帧的首帧的时候，也就是fin位为0，opcode不为0的时候，我们需要记录这些连续帧的opcode数据格式，如果当前接收到的数据帧为连续帧，也就是opcode为0的时候，我们需要纠正其opcode为之前记录的opcode，以便我们能够正确的对每一帧数据进行对应的解码。

```ts
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
```

2. PAYLOAD_LENGTH_16:

如果Payloadlength为126, 到接下来的16位中读取数据长度。

```ts
if (this.stage === Stage.PAYLOAD_LENGTH_16) {
  // bytes with payload length
  // 从当前位0开始读16位的一个无符号整型
  this.payloadLength = this.consume(2).readUInt16BE(0);
  this.stage = Stage.MASK;
}
```

3. PAYLOAD_LENGTH_64:

7位二进制能表示的最大数为127，所以当前面的数如果为127,
代表我们需要到接下来的64位中来读取数据长度.

由于nodejs并没有提供直接读取64位为整形数字的方法，我们需要先
读取前4个字节，然后读取后四个字节，将其组合为一个完整的整数.

例如: 二进制11用十进制为3, 则1 * Math.pow(2, 1) + 1 = 3;

需要注意的是这里所有的读取整型数字或者写整型数字我们都采用大端字节序(Big endian)，尽管现在x86 体系的计算机都采用小端字节序（Little endian），即相对重要的字节排在后面的内存地址，相对不重要字节排在前面的内存地址。但是很多网络设备和特定的操作系统采用的是大端字节序，例如我们这里处理的TCP流 的数据。

```ts
if (this.stage === Stage.PAYLOAD_LENGTH_64) {
  const buf = this.consume(8);
  const fisrtFourBtyesNum = buf.readUInt32BE(0);
  const secondFourBtyesNum = buf.readUInt32BE(4);
  this.stage = Stage.MASK;

  this.payloadLength = fisrtFourBtyesNum * Math.pow(2, 32) + secondFourBtyesNum;
}
```

4. MASK:

如果是被掩码的数据，需要读取32位掩码钥匙，用于解码数据。

```ts
if (this.stage === Stage.MASK) {
  if (this.isMask) {
    maskingKey = this.consume(4);
  }
  this.stage = Stage.DATA;
}
```

5. DATA:

接下来的数据就是真实的传输数据，payloadLength就是真实的数据字节长度，如果数据是被掩码了，则需要进行解码。
如果此时的opcode大于7，则表示当前处理的是一个控制帧，
需要进行特殊的处理，否则直接将其加入fragments数据片段中。

要获得解码，可以通过编码的八位元(字节，即文本数据的字符)和XOR八位元(i模4)掩码的第四个八位元进行循环。在伪代码中(恰好是有效的JavaScript):

```js
// ENCODE为掩码数据，MASK为我们的掩码KEY, DECODE为解码数据
var DECODED = "";
for (var i = 0; i < ENCODED.length; i++) {
  DECODED[i] = ENCODED[i] ^ MASK[i % 4];
}
```

处理数据的代码：

```ts
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
```

6. COMPLETE:

处理最终的数据阶段，如果当前帧的fin位是1，则表示当前帧是消息的最后一帧，
我们需要将数据片段组合起来，并根据消息的内容格式(opcode为1表示是字符串，直接转为字符串
，否则表示是二进制，不做任何处理)。转化完最后的消息数据之后，我们需要通知订阅者已经收到了信息。

处理完数据之后，需要将fragements重置为空，已经处理帧的阶段重置到HEAD阶段，
以便后续的帧重复上述处理步骤。

```ts
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
```

### 解码控制帧，并作出对应的响应，包括ping, pong, close等信号

如果Opcode大于7，则代表当前帧是一个控制帧，我们需要对其进行特殊的响应：

**关闭帧(0x08)**：表明客户端想要关闭连接，按照规范，我们可以通过读取数据的头字节为关闭的code, 以及接下来的所有字节为关闭原因的说明，同时我们需要发送一个对应的关闭帧给对面，以便完成close握手。

在经过握手之后的任意时刻里，无论客户端还是服务端都可以选择发送一个ping给另一方。 当ping消息收到的时候，接受的一方必须尽快回复一个pong消息。 例如，可以使用这种方式来确保客户端还是连接状态。

你也有可能在没有发送ping消息的情况下，获取一个pong消息，当这种情况发生的时候忽略它。

如果在你有机会发送一个pong消息之前，你已经获取了超过一个的ping消息，那么你只发送一个pong消息。

**Ping(0x09)**: 受到ping消息后，我们需要回复客户端一个pong消息，需要注意的是当你获取到一个ping消息的时候，需要回复一个跟ping消息有相同载荷数据的pong消息 (对于ping和pong，最大载荷长度位125)。

**Pong(0x0A)**: 通知订阅者我们受到了Pong消息。


```ts
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
```

### 发送消息

前面提到了对接收的二进制按照规范进行相应的解读，以获得最终的消息。

发送消息就是解码消息的反操作，将需要发送的数据进行封装，以确保客户端能按照正确的方式解读我们的消息。

需要注意的是opcode和fin位的设置：

如果是最后一帧，那么FIN为1，opcode为当前数据的格式，例如0x1, 0x2或者控制帧。
Client: FIN=1, opcode=0x1, msg="hello"
Server: (process complete message immediately) Hi.

如果不是最后一站，那么FIN为0，第一帧的opcode表示为当前消息数据的格式
Client: FIN=0, opcode=0x1, msg="and a"
Server: (listening, new message containing text started)

后续的帧opcode为0, 表示该帧是连续的帧
Client: FIN=0, opcode=0x0, msg="happy new"
Server: (listening, payload concatenated to previous message)

直到消息的最后一帧，表示FIN为1。
Client: FIN=1, opcode=0x0, msg="year!"
Server: (process complete message) Happy new year to you too!

所以如果不是消息的第一帧，我们需要设置opcode为0.

由于服务端发送给客户端的数据是不需要进行掩码的, 所以mask位永远为0.

然后是payloadLength的设置, 如果我们要发送的数据字节数大于125个字节,
则需要额外的空间来放置payloadLength的数据长度, 如果数据长度大于65535(也就是两个字节16位能表示的最大无符号整型数), 则我们需要额外的64位也就是8个字节来放置数据长度, 否则只需要两个字节来放置数据长度.

当然, 如果你的数据长度小于125个字节, 则不需要额外的空间来放置数据长度.

最后把数据copy到buffer数组中, 通过`socket.write`来进行数据写入既可。

下面是完整的代码:

```ts
const MAXIMUM_TWO_BYTES_NUMBER = 65535;
public send(data: string | Buffer, options?: IsendOptions, callback?: Function): void {
  let frameBytes = 2; // contains first two bytes
  const buf = WsClient.toBuffer(data);
  options = Object.assign({
    fin: true,
    mask: false,
    binary: typeof data !== 'string'
  }, options);

  let opcode = options.binary ? 0x02 : 0x01;

  // 如果是消息的第一帧
  if (this.isFirstFragment) {
    // 检测当前发送的fin是否是最后一帧, 如果不是, 则下一帧是连续帧
    if (!options.fin) this.isFirstFragment = false;
  } else {
    // 如果不是第一帧, 我们需要把opcode设为0, 表示为连续帧
    opcode = 0x00;
    // 如果此时fin是最后一帧，则代表下一帧为消息的第一帧，重置flag
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
```

### 追踪连接的各个客户端

为每个连接的客户端创建一个实例，这样就能够追踪多个客户端，这样每个客户端与服务器之间的通信是相互独立的，并且可以通过服务端来对所有的客户端进行广播通知等操作。

```ts
// tracking clients
const client: WsClient = new WsClient(socket);
this.clients.add(client);
client.on('close', () => {
  this.clients.delete(client);
});
```

例如：

```ts
const wss = new WebSocketServer({
  port: 8888
});

wss.on('connection', function connection(ws: WsClient) {
  // Broadcast to everyone else.
  wss.clients.forEach(client => {
    if (client !== ws) {
      client.send('hi, everyone else!')
    }
  })

  ws.on('message', function incoming(message: string) {
    console.log(message);
  });

  ws.on('close', (code, reason) => {
    console.log(code, reason);
  });

  ws.on('ping', (data) => {
    console.log('ping:', data);
  });

  ws.on('pong', (data) => {
    console.log('pong:', data.toString());
    wss.close();
  });

  setTimeout(() => {
    ws.send("Hello Client!");

    ws.ping('123');
  }, 3000);
});
```

### 能够在发生错误的时候关闭连接，并返回对应的错误码。

websocket协议定义的常用的错误码如下：

| 状态码 | 名称               | 描述                                                                                              | 状态码 |
| --------- | -------------------- | --------------------------------------------------------------------------------------------------- | --------- |
| 0–999   | -                    | 保留段, 未使用。                                                                             | 0–999   |
| 1000      | CLOSE_NORMAL         | 正常关闭; 无论为何目的而创建, 该链接都已成功完成任务。                     | 1000      |
| 1001      | CLOSE_GOING_AWAY     | 终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开。 | 1001      |
| 1002      | CLOSE_PROTOCOL_ERROR | 由于协议错误而中断连接。                                                                | 1002      |
| 1003      | CLOSE_UNSUPPORTED    | 由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据)。 | 1003      |
| 1004      | -                    | 保留。 其意义可能会在未来定义。                                                      | 1004      |
| 1005      | CLOSE_NO_STATUS      | 保留。 表示没有收到预期的状态码。                                                   | 1005      |
| 1006      | CLOSE_ABNORMAL       | 保留。 用于期望收到状态码时连接非正常关闭 (也就是说, 没有发送关闭帧)。 | 1006      |
| 1007      | Unsupported Data     | 由于收到了格式不符的数据而断开连接 (如文本消息中包含了非 UTF-8 数据)。 | 1007      |
| 1008      | Policy Violation     | 由于收到不符合约定的数据而断开连接。 这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景。 | 1008      |
| 1009      | CLOSE_TOO_LARGE      | 由于收到过大的数据帧而断开连接。                                                    | 1009      |
| 1010      | Missing Extension    | 客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接。 | 1010      |
| 1011      | Internal Error       | 客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接。     | 1011      |
| 1012      | Service Restart      | 服务器由于重启而断开连接。 [Ref]                                                       | 1012      |
| 1013      | Try Again Later      | 服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接。 [Ref] | 1013      |
| 1014      | -                    | 由 WebSocket 标准保留以便未来使用。                                                     | 1014      |
| 1015      | TLS Handshake        | 保留。 表示连接由于无法完成 TLS 握手而关闭 (例如无法验证服务器证书)。 | 1015      |
| 1016–1999 | -                    | 由 WebSocket 标准保留以便未来使用。                                                     | 1016–1999 |
| 2000–2999 | -                    | 由 WebSocket 拓展保留使用。                                                                 | 2000–2999 |
| 3000–3999 | -                    | 可以由库或框架使用。 不应由应用使用。 可以在 IANA 注册, 先到先得。      | 3000–3999 |
| 4000–4999 | -                    | 可以由应用使用。                                                                            | 4000–4999 |

### 继续可以深入考虑的扩展

- 继续支持一些websocket子协议和扩展, 例如数据加密，压缩

## Reference

https://hackernoon.com/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8

https://infoq.cn/article/deep-in-websocket-protocol

https://www.ably.io/concepts/websockets

https://rafalgolarz.com/blog/2016/12/07/writing_websocket_servers_1_of_2/

https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side

https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#%E4%BA%A4%E6%8D%A2%E6%95%B0%E6%8D%AE%E5%B8%A7

https://tools.ietf.org/html/rfc6455#section-5.4
