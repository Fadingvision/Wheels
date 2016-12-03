import Request from　 './fetch/request';
import Response from　 './fetch/response';
import Headers from　 './fetch/headers';



function argumentIsNeeded() {
	throw new TypeError('Failed to execute \'fetch\' on \'Window\': 1 argument required, but only 0 present');
}

function parseHeaders(rawHeaders) {
	var headers = new Headers()
	rawHeaders.split('\r\n').forEach(function(line) {
		var parts = line.split(':')
		var key = parts.shift().trim()
		if (key) {
			var value = parts.join(':').trim()
			headers.append(key, value)
		}
	})
	return headers;
}


function fetchs(url = argumentIsNeeded(), options) {
	return new Promise((resolve, reject) => {

		let request = new Request(url, options);
		let xhr = new XMLHttpRequest();

		// diffrience between $.ajax and fetch :
		// onload事件只会在请求成功之后触发，无论状态码是多少，只要该次请求成功就会resolve
		xhr.onload = function() {
			let responseOpts = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
			}
			responseOpts.url = 'responseURL' in xhr ? xhr.responseURL : responseOpts.headers.get('X-Request-URL')
			let body = 'response' in xhr ? xhr.response : xhr.responseText;

			resolve(new Response(body, responseOpts));
		};

		// onerror事件只会在请求失败(即是网络错误等原因，而不是非2xx状态的错误)之后触发
		xhr.onerror = function() {
			reject(new TypeError('Network request failed'))
		}

		xhr.ontimeout = function() {
			reject(new TypeError('Network request failed'))
		}


		// true表示异步
		if (request.cache) {
			xhr.open(request.method, request.url, request.async);
		} else {
			// aviod the cache(jQuery 默认清除浏览器缓存。);
			let bustCache = '?' + new Date().getTime();
			xhr.open(request.method, request.url + bustCache, request.async);
		}

		if (request.credentials === 'include') {
			xhr.withCredentials = true; // notice: 这不会影响同站(same-site)请求.
		}


		// set the headers
		request.headers.forEach((name, value) => {
			xhr.setRequestHeader(name, value);
		})

		xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	})
};

export default fetchs;