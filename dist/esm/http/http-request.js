import { getLocationComponents, optionsToKey } from 'rxcomp';
import { HttpHeaders } from './http-headers';
import { HttpParams } from './http-params';
export class HttpRequest {
    constructor(method, url, third, fourth) {
        this.url = url;
        this.reportProgress = false;
        this.withCredentials = false;
        this.hydrate = true;
        this.observe = 'body';
        this.responseType = 'json';
        // !!! remove, rethink
        const isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
        this.method = isStaticFile ? 'GET' : method.toUpperCase();
        let options;
        if (methodHasBody_(this.method) || !!fourth) {
            this.body = (third !== undefined) ? third : null;
            options = fourth;
        }
        else {
            options = third;
        }
        if (options) {
            this.reportProgress = !!options.reportProgress;
            this.withCredentials = !!options.withCredentials;
            this.observe = options.observe || this.observe;
            if (options.responseType) {
                this.responseType = options.responseType;
            }
            if (options.headers) {
                this.headers = new HttpHeaders(options.headers);
            }
            if (options.params) {
                this.params = (options.params instanceof HttpParams) ? options.params : new HttpParams(options.params, options.paramsEncoder);
            }
        }
        if (!this.headers) {
            this.headers = new HttpHeaders();
        }
        if (!this.params) {
            this.params = new HttpParams();
        }
        const params = this.params.toString();
        const index = url.indexOf('?');
        const sep = index === -1 ? '?' : (index < url.length - 1 ? '&' : '');
        this.urlWithParams = url + (params.length ? sep + params : params);
    }
    get transferKey() {
        const pathname = getLocationComponents(this.url).pathname;
        const paramsKey = optionsToKey(this.params.toObject());
        const bodyKey = optionsToKey(this.body);
        let key = `${this.method}-${pathname}-${paramsKey}-${bodyKey}`;
        key = key.replace(/(\s+)|(\W+)/g, function (...matches) { return matches[1] ? '' : '_'; });
        // console.log('transferKey', key);
        return key;
    }
    serializeBody() {
        if (this.body === null) {
            return null;
        }
        if (isArrayBuffer_(this.body) || isBlob_(this.body) || isFormData_(this.body) ||
            typeof this.body === 'string') {
            return this.body;
        }
        if (this.body instanceof HttpParams) {
            return this.body.toString();
        }
        if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
            return JSON.stringify(this.body);
        }
        return this.body.toString();
    }
    detectContentTypeHeader() {
        if (this.body === null) {
            return null;
        }
        if (isFormData_(this.body)) {
            return null;
        }
        if (isBlob_(this.body)) {
            return this.body.type || null;
        }
        if (isArrayBuffer_(this.body)) {
            return null;
        }
        if (typeof this.body === 'string') {
            return 'text/plain';
        }
        if (this.body instanceof HttpParams) {
            return 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        if (typeof this.body === 'object' || typeof this.body === 'number' ||
            Array.isArray(this.body)) {
            return 'application/json';
        }
        return null;
    }
    toInitRequest() {
        return {
            method: this.method,
            headers: this.headers.serialize(),
            body: this.serializeBody(),
            mode: 'same-origin',
            credentials: 'same-origin',
            cache: 'default',
            redirect: 'error',
        };
    }
    toFetchRequest__() {
        return new Request(this.urlWithParams, this.toInitRequest());
        /*
        Request.cache Read only
        Contains the cache mode of the request (e.g., default, reload, no-cache).
        Request.context Read only
        Contains the context of the request (e.g., audio, image, iframe, etc.)
        Request.credentials Read only
        Contains the credentials of the request (e.g., omit, same-origin, include). The default is same-origin.
        Request.destination Read only
        Returns a string from the RequestDestination enum describing the request's destination. This is a string indicating the type of content being requested.
        Request.headers Read only
        Contains the associated Headers object of the request.
        Request.integrity Read only
        Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
        Request.method Read only
        Contains the request's method (GET, POST, etc.)
        Request.mode Read only
        Contains the mode of the request (e.g., cors, no-cors, same-origin, navigate.)
        Request.redirect Read only
        Contains the mode for how redirects are handled. It may be one of follow, error, or manual.
        Request.referrer Read only
        Contains the referrer of the request (e.g., client).
        Request.referrerPolicy Read only
        Contains the referrer policy of the request (e.g., no-referrer).
        Request.url Read only
        Contains the URL of the request.
        Request implements Body, so it also inherits the following properties:
        body Read only
        A simple getter used to expose a ReadableStream of the body contents.
        bodyUsed Read only
        Stores a Boolean that declares whether the body has been used in a response yet.
        */
    }
    clone(options) {
        options = Object.assign({
            headers: this.headers,
            reportProgress: this.reportProgress,
            params: this.params,
            responseType: this.responseType,
            withCredentials: this.withCredentials,
            observe: this.observe,
            body: this.body,
            url: this.url,
            method: this.method,
        }, options || {});
        const clone = new HttpRequest(this.method, this.url, this.body, options);
        return clone;
    }
    toObject() {
        const request = {};
        request.url = this.url;
        request.method = this.method;
        request.headers = this.headers.toObject();
        request.params = this.params.toObject();
        request.body = this.body;
        request.reportProgress = this.reportProgress;
        request.responseType = this.responseType;
        request.withCredentials = this.withCredentials;
        request.observe = this.observe;
        return request;
    }
}
function methodHasBody_(method) {
    switch (method) {
        case 'DELETE':
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
        case 'JSONP':
            return false;
        default:
            return true;
    }
}
function isArrayBuffer_(value) {
    return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}
function isBlob_(value) {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}
function isFormData_(value) {
    return typeof FormData !== 'undefined' && value instanceof FormData;
}
