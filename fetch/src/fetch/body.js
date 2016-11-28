/**
 * body代表了request/response的传输内容体,
 * 它用于声明传输的content type, 和它应该怎么被处理。
 * 该类不能直接实例化使用，一般作为request和response对象内部继承的基类
 */
export default class Body {
	constructor() {
		if(new.target === Body) throw new Error('this function can\'t be instanced');
		this.bodyUsed = false;
	}


	/**
	 * body可以接受的类型：
	 * blob,　file
	 * string
	 * FormData			
	 */
	_initBody(body) {
		if(!body) {
			this._bodyText = '';
		} else if (typeof body === 'string') {
			this._bodyText = body;
		}
	}

	// 比起xhrHttpRequest来，这些方法让非文本的数据使用起来更加简单
	arrayBuffer() {}

	blob() {}

	json() {}

	text() {}

	formData () {}
}