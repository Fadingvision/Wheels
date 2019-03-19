// 转换有问题
// import EventEmitter from 'events';
// import http from 'http';

// import EventEmitter = require('events');
// import http = require('http');

import * as EventEmitter from 'events';
import * as http from 'http';

export default class WebSocketServer extends EventEmitter {
  constructor() {
    super();
    http.createServer((req, res) => {

    })
  }


}