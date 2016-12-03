import Body from './body';
import Body from './body';


export default class Response extends Body {

    constructor(body, responseOpts = {}) {
        super();

        this.url = responseOpts.url || '';
        this.type = 'default';
        this.status = 'status' in responseOpts ? responseOpts.status : 200;
        this.statusText = 'statusText' in responseOpts ? responseOpts.statusText : 'OK';
        this.ok = responseOpts.status >= 200 && responseOpts.status <= 299;
        this.headers = responseOpts.headers;
        this._initBody(body);
    }

    clone() {
        return new Response(this.bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            url: this.url
        })
    }

    error() {
        var response = new Response(null, {
            status: 0,
            statusText: ''
        })
        response.type = 'error'
        return response
    }

    redirect() {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code')
        }

        return new Response(null, {
            status: status,
            headers: {
                location: url
            }
        })
    }
}