"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseBase = exports.HttpResponse = exports.HttpHeaderResponse = void 0;
var http_event_1 = require("./http-event");
var http_headers_1 = require("./http-headers");
var HttpHeaderResponse = /** @class */ (function () {
    function HttpHeaderResponse(options) {
        this.status = 200;
        this.statusText = 'OK';
        this.type = http_event_1.HttpEventType.ResponseHeader;
        if (options) {
            this.headers = new http_headers_1.HttpHeaders(options.headers);
            this.status = options.status || this.status;
            this.statusText = options.statusText || this.statusText;
            this.url = options.url || this.url;
        }
        this.ok = this.status >= 200 && this.status < 300;
    }
    HttpHeaderResponse.prototype.clone = function (options) {
        options = Object.assign({
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            ok: this.ok,
            type: this.type,
        }, options || {});
        var clone = new HttpHeaderResponse(options);
        return clone;
    };
    return HttpHeaderResponse;
}());
exports.HttpHeaderResponse = HttpHeaderResponse;
var HttpResponse = /** @class */ (function () {
    function HttpResponse(options) {
        this.status = 200;
        this.statusText = 'OK';
        this.type = http_event_1.HttpEventType.Response;
        this.body = null;
        if (options) {
            this.headers = new http_headers_1.HttpHeaders(options.headers);
            this.status = options.status || this.status;
            this.statusText = options.statusText || this.statusText;
            this.url = options.url || this.url;
            this.body = options.body || this.body;
        }
        this.ok = this.status >= 200 && this.status < 300;
    }
    HttpResponse.prototype.clone = function (options) {
        options = Object.assign({
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url,
            ok: this.ok,
            type: this.type,
            body: this.body,
        }, options || {});
        var clone = new HttpResponse(options);
        return clone;
    };
    HttpResponse.prototype.toObject = function () {
        var response = {};
        response.url = this.url;
        response.headers = this.headers.toObject();
        response.status = this.status;
        response.statusText = this.statusText;
        response.ok = this.ok;
        response.type = this.type;
        response.body = this.body;
        return response;
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
var HttpResponseBase = /** @class */ (function () {
    function HttpResponseBase(options, defaultStatus, defaultStatusText) {
        if (defaultStatus === void 0) { defaultStatus = 200; }
        if (defaultStatusText === void 0) { defaultStatusText = 'OK'; }
        this.status = 200;
        this.statusText = 'OK';
        this.headers = options.headers || new http_headers_1.HttpHeaders();
        this.status = options.status !== undefined ? options.status : defaultStatus;
        this.statusText = options.statusText || defaultStatusText;
        this.url = options.url || undefined;
        this.ok = this.status >= 200 && this.status < 300;
    }
    return HttpResponseBase;
}());
exports.HttpResponseBase = HttpResponseBase;
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
