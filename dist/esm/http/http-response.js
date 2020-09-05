import { HttpEventType } from './http-event';
import { HttpHeaders } from './http-headers';
export class HttpHeaderResponse {
    constructor(options) {
        this.status = 200;
        this.statusText = 'OK';
        this.type = HttpEventType.ResponseHeader;
        if (options) {
            this.headers = new HttpHeaders(options.headers);
            this.status = options.status || this.status;
            this.statusText = options.statusText || this.statusText;
            this.url = options.url || this.url;
        }
        this.ok = this.status >= 200 && this.status < 300;
    }
    clone(options) {
        options = Object.assign({
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            ok: this.ok,
            type: this.type,
        }, options || {});
        const clone = new HttpHeaderResponse(options);
        return clone;
    }
}
export class HttpResponse {
    constructor(options) {
        this.status = 200;
        this.statusText = 'OK';
        this.type = HttpEventType.Response;
        this.body = null;
        if (options) {
            this.headers = new HttpHeaders(options.headers);
            this.status = options.status || this.status;
            this.statusText = options.statusText || this.statusText;
            this.url = options.url || this.url;
            this.body = options.body || this.body;
        }
        this.ok = this.status >= 200 && this.status < 300;
    }
    clone(options) {
        options = Object.assign({
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            ok: this.ok,
            type: this.type,
            body: this.body,
        }, options || {});
        const clone = new HttpResponse(options);
        return clone;
    }
    toObject() {
        const response = {};
        response.url = this.url;
        response.headers = this.headers.toObject();
        response.status = this.status;
        response.statusText = this.statusText;
        response.ok = this.ok;
        response.type = this.type;
        response.body = this.body;
        return response;
    }
}
export class HttpResponseBase {
    constructor(options, defaultStatus = 200, defaultStatusText = 'OK') {
        this.status = 200;
        this.statusText = 'OK';
        this.headers = options.headers || new HttpHeaders();
        this.status = options.status !== undefined ? options.status : defaultStatus;
        this.statusText = options.statusText || defaultStatusText;
        this.url = options.url || undefined;
        this.ok = this.status >= 200 && this.status < 300;
    }
}
/*
// !!!
export default class HttpResponse {
    data?: any;
    url: string = '';
    status: number = 0;
    statusText: string = '';
    ok: boolean = false;
    redirected: boolean = false;
    get static() {
        return this.url!.indexOf('.json') === this.url!.length - 5;
    }
    constructor(response: Response) {
        this.data = null;
        if (response) {
            this.url = response.url;
            this.status = response.status;
            this.statusText = response.statusText;
            this.ok = response.ok;
            this.redirected = response.redirected;
        }
    }
}
*/
