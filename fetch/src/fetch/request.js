import Headers from './headers'
import Body from './body';

function argumentIsNeeded() {
	throw new　 TypeError('Failed to execute \'Request\': 1 argument required, but only 0 present');
}

function newIsNeeded() {
	throw new　 TypeError('this function must be called with new keyword');
}

const DefaultOpts = {
	method: 'GET',
	body: JSON.strigify({}),
	headers: {},
	credentials: 'omit', // don't include authentication credentials (e.g. cookies) in the request
	async: true,
	cache: false,
}
export default class Request extends Body {

	/**
	 * request构造函数
	 * @param  {[type]} input  url或者request实例对象
	 * @param  {[type]} opts 参数选项
	 * @return {[type]}      request实例对象
	 */
	constructor(input = argumentIsNeeded(), options = {}) {
		if (new.target === undefined) newIsNeeded();

		super();

		if (typeof input === 'string') options.url = input;

		let opts = typeof input === 'object' ? Object.assign(DefaultOpts, input, options) :
			Object.assign(DefaultOpts, options);

		let body = opts.body;

		if (typeof input === 'object') {

			// url只能用input里面的属性，而不能通过options传入进来
			this.url = input.url;

			// body只能够使用一次
			if (input.bodyUsed) {
				throw new TypeError('Already read');
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
				value: '',
				enumerable: true
			}
		});

		// 当请求为get或者head请求的时候不能够设置Body
		if ((this.method === 'GET' || this.method === 'HEAD') && body) {
			throw new TypeError('Body not allowed for GET or HEAD requests')
		}

		// 初始化自身的body属性
		this._initBody(body);
	}


	clone() {
		return new Request(this, {
			// 避免改变原request对象的bodyUsed属性
			body: this._bodyInit
		})
	}
}