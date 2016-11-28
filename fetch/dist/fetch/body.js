"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * body代表了request/response的传输内容体,
 * 它用于声明传输的content type, 和它应该怎么被处理。
 * 该类不能直接实例化使用，一般作为request和response对象内部继承的基类
 * 
 */
var Body = (function () {
  function Body() {
    _classCallCheck(this, Body);
  }

  _prototypeProperties(Body, null, {
    arrayBuffer: {
      value: function arrayBuffer() {},
      writable: true,
      configurable: true
    }
  });

  return Body;
})();

module.exports = Body;