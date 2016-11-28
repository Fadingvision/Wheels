"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Request = _interopRequire(require("./fetch/request"));

var Response = _interopRequire(require("./fetch/response"));

var Headers = _interopRequire(require("./fetch/headers"));





function argumentIsNeeded() {
	throw new TypeError("Failed to execute 'fetch' on 'Window': 1 argument required, but only 0 present");
}

function parseHeaders(rawHeaders) {
	var headers = new Headers();

	return headers;
}


function fetch(_x, options) {
	var url = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
	return new Promise(function (resolve, reject) {
		var request = new Request(url, options);
		var xhr = new XMLHttpRequest();

		// diffrience between $.ajax and fetch :
		// onload事件只会在请求成功之后触发，无论状态码是多少，只要该次请求成功就会resolve
		xhr.onload = function () {
			var responseOpts = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: parseHeaders(xhr.getAllResponseHeaders() || "") };
			responseOpts.url = "responseURL" in xhr ? xhr.responseURL : responseOpts.headers.get("X-Request-URL");
			var body = "response" in xhr ? xhr.response : xhr.responseText;

			resolve(new Response(body, responseOpts));
		};

		// onerror事件只会在请求失败(即是网络错误等原因，而不是非2xx状态的错误)之后触发
		xhr.onerror = function () {
			reject(new TypeError("Network request failed"));
		};

		xhr.ontimeout = function () {
			reject(new TypeError("Network request failed"));
		};


		// true表示异步
		if (request.cache) {
			xhr.open(request.method, request.url, request.async);
		} else {
			// aviod the cache(jQuery 默认清除浏览器缓存。);
			var bustCache = "?" + new Date().getTime();
			xhr.open(request.method, request.url + bustCache, request.async);
		}

		if (request.credentials === "include") {
			xhr.withCredentials = true; // notice: 这不会影响同站(same-site)请求.
		}


		// set the headers
		request.headers.forEach(function (name, value) {
			xhr.setRequestHeader(name, value);
		});

		xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
	});
};

module.exports = fetch;