import { HttpEventType } from './http-event';
import { HttpHeaders } from './http-headers';
export class HttpErrorResponse extends Error {
    constructor(options) {
        super((options === null || options === void 0 ? void 0 : options.message) || 'Unknown Error');
        this.status = 0;
        this.statusText = 'Unknown Error';
        this.ok = false;
        this.type = HttpEventType.ResponseError;
        this.message = 'Unknown Error';
        this.name = 'HttpErrorResponse';
        if (options) {
            this.headers = new HttpHeaders(options.headers);
            this.status = options.status || this.status;
            this.statusText = options.statusText || this.statusText;
            this.url = options.url || this.url;
            this.error = options.error || this.error;
            this.name = options.name || this.name;
            this.request = options.request || null;
        }
    }
    clone(options) {
        options = Object.assign({
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            error: this.error,
            message: this.message,
            name: this.name,
            request: this.request,
        }, options || {});
        const clone = new HttpErrorResponse(options);
        return clone;
    }
}
