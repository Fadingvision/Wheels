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


function bufferClone(buf) {
    if (buf.slice) {
        return buf.slice(0)
    } else {
        var view = new Uint8Array(buf.byteLength)
        view.set(new Uint8Array(buf))
        return view.buffer
    }
}


function consumed(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('already read'))
    }
    body.bodyUsed = true;
    return undefined;
}

function fileReaderReady(reader) {
    return new Promise((resolve, reject) {
        reader.onload = () => {
            resolve(reader.result)
        };
        reader.onerror = () => {
            reject(reader.error)
        };
    })
}

function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);

    reader.readAsArraybuffer(blob);
    return promise;

}

function readBlobAsText() {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);

    reader.readAsText(blob);
    return promise;

}

/**
 * 将ArrayBuffer对象读成文字字符串的格式
 * @return {[type]} [description]
 */
function readArrayBufferAsText(buffer) {
    var view = new Uint8Array(buffer);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
        chars[i] = String.fromCharCode(view[i]);
    }

    return chars.join('');
}


/**
 * 将字符串解析成arrayBuffer的格式
 * @return {[type]} [description]
 */
function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
        if (bytes) {
            var split = bytes.split('=')
            var name = split.shift().replace(/\+/g, ' ')
            var value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name), decodeURIComponent(value))
        }
    })
    return form
}

export default class Body {
    constructor() {
        if (new.target === Body) throw new Error('this function can\'t be instanced');
        this.bodyUsed = false;
    }


    /**
     * body可以接受的类型：
     * string(所有非字符串类型的值都应该通过JSON.stringify()序列化之后在传入Body处理)
     * blob, file;
     * FormData;
     * ArrayBuffer;
     */


    /**
     * 初始化body内容体(用于request中处理传入的内容体)
     * @param  {[type]} body 传入的内容体
     * @return {[type]}      [description]
     */
    _initBody(body) {
        if (!body) {
            this._bodyText = '';

            // string
        } else if (typeof body === 'string') {
            this._bodyText = body;

            // blob or file
        } else if (Blob.prototype.isPrototypeof(body) && support.blob) {
            this._bodyBlob = body;

            // formData
        } else if (support.formData && body instaceof FormData) {
            // xhr可以直接send FormData格式的数据
            this._bodyFormData = body
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            // 如果是URLSearchParams对象，则转成string进行处理
            this._bodyText = body.toString()

            // ArrayBuffer
            // 对于arrayBuffer的部分不是很理解
        } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer)

            // IE 10-11 can't handle a DataView body.（因此包装成blob对象）
            this._bodyInit = new Blob([this._bodyArrayBuffer])
        } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body)
        } else {
            throw new Error('unsupported BodyInit Type')
        }

        // 比起xhrHttpRequest来，这些方法让非文本的数据使用起来更加简单

        /*
            blob对象使用方法
            var aBlob = new Blob( array, options );
            array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString等对象构成的 Array ，
            或者其他类似对象的混合体，它将会被放进 Blob.
        */

        /**
         * 使用一个blob来读取响应流中的数据（只有blob和arrayBuffer能被读成blob格式），并将bodyUsed状态改为已使用。
         * @return {promise}  It returns a promise that resolves with a Blob.
         */
        blob() {
            let rejectedPromise = cosumed(this);
            if (rejectedPromise) return rejectedPromise;

            if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyText) {
                return Promise.resolve(new Blob([this._bodyText]))
            } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as blob')
            }
        }


        /**
         * 使用一个buffer数组来读取响应流中的数据（只有blob和arrayBuffer能被读成buffer格式），并将bodyUsed状态改为已使用。
         * @return {promise}  It returns a promise that resolves with an ArrayBuffer.
         */
        arrayBuffer() {
            if (this._bodyArrayBuffer) {
                // 如果是二进制数组，则直接返回
                return cosumed(this) || Promise.resolve(this._body)
            } else {
                // 如果是blob或者text，则先转成blob对象在通过fileReader处理成二进制数组后再返回
                return this.blob().then(readBlobAsArrayBuffer);
            }
        }



        text() {
            let rejectedPromise = cosumed(this);
            if (rejectedPromise) return rejectedPromise;

            if (this._bodyBlob) {
                // 把blob对象读成text格式
                return readBlobAsText();
            } else if (this._bodyArrayBuffer) {
                // 把_bodyArrayBuffer对象读成text格式
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
            } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as text')
            } else {
                return Promise.resolve(this._bodyText)
            }
        }

        json() {
            // 如果response确定返回的是json格式的对象，则把由text处理后的值直接返回由json.parse处理后的Promise
            return this.text().then(JSON.parse);
        }

        formData() {
            // 如果response确定返回的是formData格式的对象，则把由text处理后的值直接返回由decode处理后的Promise
            return this.text().then(decode)
        }
    }