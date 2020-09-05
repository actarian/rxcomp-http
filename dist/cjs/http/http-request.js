"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
var rxcomp_1 = require("rxcomp");
var http_headers_1 = require("./http-headers");
var http_params_1 = require("./http-params");
var HttpRequest = /** @class */ (function () {
    function HttpRequest(method, url, third, fourth) {
        this.url = url;
        this.reportProgress = false;
        this.withCredentials = false;
        this.hydrate = true;
        this.observe = 'body';
        this.responseType = 'json';
        // !!! remove, rethink
        var isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
        this.method = isStaticFile ? 'GET' : method.toUpperCase();
        var options;
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
                this.headers = new http_headers_1.HttpHeaders(options.headers);
            }
            if (options.params) {
                this.params = (options.params instanceof http_params_1.HttpParams) ? options.params : new http_params_1.HttpParams(options.params, options.paramsEncoder);
            }
        }
        if (!this.headers) {
            this.headers = new http_headers_1.HttpHeaders();
        }
        if (!this.params) {
            this.params = new http_params_1.HttpParams();
        }
        var params = this.params.toString();
        var index = url.indexOf('?');
        var sep = index === -1 ? '?' : (index < url.length - 1 ? '&' : '');
        this.urlWithParams = url + (params.length ? sep + params : params);
    }
    Object.defineProperty(HttpRequest.prototype, "transferKey", {
        get: function () {
            var pathname = rxcomp_1.getLocationComponents(this.url).pathname;
            var paramsKey = rxcomp_1.optionsToKey(this.params.toObject());
            var bodyKey = rxcomp_1.optionsToKey(this.body);
            var key = this.method + "-" + pathname + "-" + paramsKey + "-" + bodyKey;
            key = key.replace(/(\s+)|(\W+)/g, function () {
                var matches = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    matches[_i] = arguments[_i];
                }
                return matches[1] ? '' : '_';
            });
            // console.log('transferKey', key);
            return key;
        },
        enumerable: false,
        configurable: true
    });
    HttpRequest.prototype.serializeBody = function () {
        if (this.body === null) {
            return null;
        }
        if (isArrayBuffer_(this.body) || isBlob_(this.body) || isFormData_(this.body) ||
            typeof this.body === 'string') {
            return this.body;
        }
        if (this.body instanceof http_params_1.HttpParams) {
            return this.body.toString();
        }
        if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
            return JSON.stringify(this.body);
        }
        return this.body.toString();
    };
    HttpRequest.prototype.detectContentTypeHeader = function () {
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
        if (this.body instanceof http_params_1.HttpParams) {
            return 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        if (typeof this.body === 'object' || typeof this.body === 'number' ||
            Array.isArray(this.body)) {
            return 'application/json';
        }
        return null;
    };
    HttpRequest.prototype.toInitRequest = function () {
        return {
            method: this.method,
            headers: this.headers.serialize(),
            body: this.serializeBody(),
            mode: 'same-origin',
            credentials: 'same-origin',
            cache: 'default',
            redirect: 'error',
        };
    };
    HttpRequest.prototype.toFetchRequest__ = function () {
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
    };
    HttpRequest.prototype.clone = function (options) {
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
        var clone = new HttpRequest(this.method, this.url, this.body, options);
        return clone;
    };
    HttpRequest.prototype.toObject = function () {
        var request = {};
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
    };
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
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
