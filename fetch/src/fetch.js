
import Request from　'./fetch/request';

;((self) => {

	function argumentIsNeeded() {
		throw new　 TypeError('Failed to execute \'fetch\' on \'Window\': 1 argument required, but only 0 present');
	}

	// const DefaultOpts = {
	// 	method: 'GET',
	// 	body: JSON.strigify({}),
	// 	headers: {},
	// 	credentials: 'omit', // don't include authentication credentials (e.g. cookies) in the request
	// 	async: true,
	// }

	self.fetch = function(url = argumentIsNeeded(), options) {
		// let opts = object.assign(DefaultOpts, options);
		return new Promise((resolve, reject) => {

            var request = new Request(input, options);
			let xhr = new XMLHttpRequest();

			// onload事件只会在请求成功之后触发
			xhr.onload = function(e) {
				// set the respenseType
				var xhr = e.target;
				if (xhr.responeseType = 'json') {
					var data = xhr.response;
				} else {
					var data = JSON.parse(xhr.responseText);
				}
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
				// 对 Ajax 请求进行缓存的浏览器特性都快被我们忘记了。例如，IE 就默认是这样。
				// aviod the cache(jQuery 默认清除浏览器缓存。);
				var bustCache = '?' + new Date().getTime();
				xhr.open(request.type, request.url + bustCache, true);
			}

			if(request.credentials === 'omit') {
				xhr.withCredentials = true;
			}

			xhr.send(request.data);
			// set the headers
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		})
	};


}(typeof self !== 'undefined' ? self : this));