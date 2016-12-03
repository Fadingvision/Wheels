/**
 * body������request/response�Ĵ���������,
 * ���������������content type, ����Ӧ����ô������
 * ���಻��ֱ��ʵ����ʹ�ã�һ����Ϊrequest��response�����ڲ��̳еĻ���
 */

const support = {
    // ��Blob�ж�ȡ���ݵ�Ψһ������ʹ�� FileReader��
    blob: 'FileReader' in self && 'Blob' in self && (() => {
        try {
            new Blob(); // eslint-disable-line
            return true
        } catch (e) {
            return false
        }
    })(),
    formData: 'FormData' in self,
    searchParams: 'URLSearchParams' in self,
    arrayBuffer: 'ArrayBuffer' in self
}

let isDataView, isArrayBufferView;
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

    isDataView = function(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
    }

    isArrayBufferView = ArrayBuffer.isView || function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1 // eslint-disable-line
    }
}


function bufferClone(buf) {
    if (buf.slice) {
        return buf.slice(0) // eslint-disable-line
    }
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
}


function consumed(body) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('already read'))
    }
    body.bodyUsed = true;
    return undefined;
}

function fileReaderReady(reader) {
    return new Promise((resolve, reject) => {
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

function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);

    reader.readAsText(blob);
    return promise;

}

/**
 * ��ArrayBuffer������������ַ����ĸ�ʽ
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
 * ���ַ���������arrayBuffer�ĸ�ʽ
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
        // if (new.target === Body) throw new Error('this function can\'t be instanced');
        this.bodyUsed = false;
    }


    /**
     * body���Խ��ܵ����ͣ�
     * string(���з��ַ������͵�ֵ��Ӧ��ͨ��JSON.stringify()���л�֮���ڴ���Body����)
     * blob, file;
     * FormData;
     * ArrayBuffer;
     */


    /**
     * ��ʼ��body������(����request�д������������)
     * @param  {[type]} body �����������
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
        } else if (support.formData && body instanceof FormData) {
            // xhr����ֱ��send FormData��ʽ������
            this._bodyFormData = body
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            // �����URLSearchParams������ת��string���д���
            this._bodyText = body.toString()

            // ArrayBuffer
            // ����arrayBuffer�Ĳ��ֲ��Ǻ����
        } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer)

            // IE 10-11 can't handle a DataView body.����˰�װ��blob����
            this._bodyInit = new Blob([this._bodyArrayBuffer])
        } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body)
        } else {
            throw new Error('unsupported BodyInit Type')
        }


    }

    // ����xhrHttpRequest������Щ�����÷��ı�������ʹ���������Ӽ�

    /*
        blob����ʹ�÷���
        var aBlob = new Blob( array, options );
        array ��һ����ArrayBuffer, ArrayBufferView, Blob, DOMString�ȶ��󹹳ɵ� Array ��
        �����������ƶ���Ļ���壬�����ᱻ�Ž� Blob.
    */

    /**
     * ʹ��һ��blob����ȡ��Ӧ���е����ݣ�ֻ��blob��arrayBuffer�ܱ�����blob��ʽ��������bodyUsed״̬��Ϊ��ʹ�á�
     * @return {promise}  It returns a promise that resolves with a Blob.
     */
    blob() {
        let rejectedPromise = consumed(this);
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
     * ʹ��һ��buffer��������ȡ��Ӧ���е����ݣ�ֻ��blob��arrayBuffer�ܱ�����buffer��ʽ��������bodyUsed״̬��Ϊ��ʹ�á�
     * @return {promise}  It returns a promise that resolves with an ArrayBuffer.
     */
    arrayBuffer() {
        if (this._bodyArrayBuffer) {
            // ����Ƕ��������飬��ֱ�ӷ���
            return consumed(this) || Promise.resolve(this._body)
        }
        // �����blob����text������ת��blob������ͨ��fileReader����ɶ�����������ٷ���
        return this.blob().then(readBlobAsArrayBuffer);
    }



    text() {
        let rejectedPromise = consumed(this);
        if (rejectedPromise) return rejectedPromise;

        if (this._bodyBlob) {
            // ��blob�������text��ʽ
            return readBlobAsText(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
            // ��_bodyArrayBuffer�������text��ʽ
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
        } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
        } else {
            return Promise.resolve(this._bodyText)
        }
    }

    json() {
        // ���responseȷ�����ص���json��ʽ�Ķ��������text������ֱֵ�ӷ�����json.parse������Promise
        return this.text().then(JSON.parse);
    }

    formData() {
        // ���responseȷ�����ص���formData��ʽ�Ķ��������text������ֱֵ�ӷ�����decode������Promise
        return this.text().then(decode)
    }
}