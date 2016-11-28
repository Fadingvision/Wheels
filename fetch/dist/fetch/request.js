"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Headers = _interopRequire(require("./headers"));

function argumentIsNeeded() {
	throw new TypeError("Failed to execute 'Request': 1 argument required, but only 0 present");
}

var DefaultOpts = {
	method: "GET",
	body: JSON.strigify({}),
	headers: {},
	credentials: "omit", // don't include authentication credentials (e.g. cookies) in the request
	async: true,
	cache: false };
var Request = (function (Body) {
	/**
  * request构造函数
  * @param  {[type]} input  url或者request实例对象
  * @param  {[type]} opts 参数选项
  * @return {[type]}      request实例对象
  */
	function Request() {
		var input = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
		var options = arguments[1] === undefined ? {} : arguments[1];
		_classCallCheck(this, Request);

		if (typeof input === "string") options.url = input;

		var opts = typeof input === "object" ? Object.assign(DefaultOpts, input, options) : Object.assign(DefaultOpts, options);

		var body = opts.body;

		if (typeof input === "object") {
			// url只能用input里面的属性，而不能通过options传入进来
			this.url = input.url;

			// body只能够使用一次
			if (input.bodyUsed) {
				throw new TypeError("Already read");
			}

			// 如果没有传入Body属性，则以传入的request的实例对象的_bodyInit当作body(内部私有属性)
			if (!body && input._bodyInit !== null) {
				body = input._bodyInit;
				// 改变原来的request对象的bodyUsed属性
				input.bodyUsed = true;
			}
		}

		// context, referrer, redirect
		Object.defineProperties(this, {
			headers: {
				value: new Headers(opts.headers),
				enumerable: true
			},
			method: {
				value: opts.method,
				enumerable: true
			},
			credentials: {
				value: opts.credentials,
				enumerable: true
			},
			async: {
				value: opts.async,
				enumerable: true
			},
			cache: {
				value: opts.cache,
				enumerable: true
			},
			mode: {
				value: opts.mode,
				enumerable: true
			},
			referrer: {
				value: null,
				enumerable: true
			},
			integrity: {
				value: "",
				enumerable: true
			}
		});

		// 当请求为get或者head请求的时候不能够设置Body
		if ((this.method === "GET" || this.method === "HEAD") && body) {
			throw new TypeError("Body not allowed for GET or HEAD requests");
		}

		// 初始化自身的body属性
		this._initBody(body);
	}

	_inherits(Request, Body);

	_prototypeProperties(Request, null, {
		clone: {
			value: function clone() {
				return new Request(this, {
					// 避免改变原request对象的bodyUsed属性
					body: this._bodyInit
				});
			},
			writable: true,
			configurable: true
		}
	});

	return Request;
})(Body);

module.exports = Request;