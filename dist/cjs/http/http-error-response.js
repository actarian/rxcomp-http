"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrorResponse = void 0;
var tslib_1 = require("tslib");
var http_event_1 = require("./http-event");
var http_headers_1 = require("./http-headers");
var HttpErrorResponse = /** @class */ (function (_super) {
    tslib_1.__extends(HttpErrorResponse, _super);
    function HttpErrorResponse(options) {
        var _this = _super.call(this, (options === null || options === void 0 ? void 0 : options.message) || 'Unknown Error') || this;
        _this.status = 0;
        _this.statusText = 'Unknown Error';
        _this.ok = false;
        _this.type = http_event_1.HttpEventType.ResponseError;
        _this.message = 'Unknown Error';
        _this.name = 'HttpErrorResponse';
        if (options) {
            _this.headers = new http_headers_1.HttpHeaders(options.headers);
            _this.status = options.status || _this.status;
            _this.statusText = options.statusText || _this.statusText;
            _this.url = options.url || _this.url;
            _this.error = options.error || _this.error;
            _this.name = options.name || _this.name;
            _this.request = options.request || null;
        }
        return _this;
    }
    HttpErrorResponse.prototype.clone = function (options) {
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
        var clone = new HttpErrorResponse(options);
        return clone;
    };
    return HttpErrorResponse;
}(Error));
exports.HttpErrorResponse = HttpErrorResponse;
