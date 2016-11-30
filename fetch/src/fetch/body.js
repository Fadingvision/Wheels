/**
 * body代表了request/response的传输内容体,
 * 它用于声明传输的content type, 和它应该怎么被处理。
 * 该类不能直接实例化使用，一般作为request和response对象内部继承的基类
 */

const support = {
	// 从Blob中读取内容的唯一方法是使用 FileReader。
	blob: 'FileReader' in self && 'Blob' in self && (() => {
		try {
			new Blob()
			return true
		} catch {
			return false
		}
	}()),
	formData: 'FormData' in self,
	searchParams: 'URLSearchParams' in self,
	arrayBuffer: 'ArrayBuffer' in self
}

if (support.arrayBuffer) {
    var viewClasses = [
        '[object Int8Array]',
        '[object Uint8Array]',
        '[object Uint8ClampedArray]',
        '[object Int16Array]',
        '[object Uint16Array]',
        '[object Int32Array]',
        '[object Uint32Array]',
        '[object Float32Array]',
        '[object Float64Array]'
    ]

    var isDataView = function(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

export default class Body {
	constructor() {
		if (new.target === Body) throw new Error('this function can\'t be instanced');
		this.bodyUsed = false;
	}


	/**
	 * body可以接受的类型：
	 * string(所有非字符串类型的值都应该通过JSON.stringify()序列化之后在传入Body处理)
	 * blob,　file
	 * FormData	+		
	 */
	_initBody(body) {
		if (!body) {
			this._bodyText = '';
			// string
		} else if (typeof body === 'string') {
			this._bodyText = body;
			// blob
		} else if (Blob.prototype.isPrototypeof(body) && support.blob) {
			this._bodyBlob = body;
		} else if (support.formData && body instaceof FormData) {
			// xhr可以直接send FormData格式的数据
			this._bodyFormData = body
		} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
			// 如果是URLSearchParams对象，则转成string进行处理
			this._bodyText = body.toString()
		} else if(support.arrayBuffer && support.blob && isDataView(body))

		// 比起xhrHttpRequest来，这些方法让非文本的数据使用起来更加简单
		arrayBuffer() {}

		blob() {}

		json() {}

		text() {}

		formData() {}
	}