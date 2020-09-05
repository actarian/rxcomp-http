"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeaders = void 0;
var HttpHeaders = /** @class */ (function () {
    function HttpHeaders(options) {
        var _this = this;
        var _a;
        this.headers_ = new Map();
        var headers = this.headers_;
        if (options instanceof HttpHeaders) {
            options.headers_.forEach(function (value, key) {
                headers.set(key, value);
            });
        }
        else if (typeof ((_a = options) === null || _a === void 0 ? void 0 : _a.forEach) === 'function') {
            options.forEach(function (value, key) {
                headers.set(key, value.split(', '));
            });
        }
        else if (typeof options === 'object') {
            Object.keys(options).forEach(function (key) {
                var values = options[key];
                if (typeof values === 'string') {
                    values = [values];
                }
                if (headers.has(key)) {
                    values.forEach(function (value) { return _this.append(key, value); });
                }
                else {
                    headers.set(key, values);
                }
            });
        }
        else if (typeof options === 'string') {
            options.split('\n').forEach(function (line) {
                var index = line.indexOf(':');
                if (index > 0) {
                    var key = line.slice(0, index);
                    ;
                    var value = line.slice(index + 1).trim();
                    if (headers.has(key)) {
                        _this.append(key, value);
                    }
                    else {
                        headers.set(key, [value]);
                    }
                }
            });
        }
        if (!headers.has('Accept')) {
            headers.set('Accept', ['application/json', 'text/plain', '*/*']);
        }
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', ['application/json']);
        }
    }
    HttpHeaders.prototype.has = function (key) {
        return this.headers_.has(key);
    };
    HttpHeaders.prototype.get = function (key) {
        var values = this.headers_.get(key);
        return values ? values.join(', ') : null;
    };
    HttpHeaders.prototype.set = function (key, value) {
        var clone = this.clone_();
        clone.headers_.set(key, value.split(', '));
        return clone;
    };
    HttpHeaders.prototype.append = function (key, value) {
        var clone = this.clone_();
        var values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
        values.push(value);
        clone.headers_.set(key, values);
        return clone;
    };
    HttpHeaders.prototype.delete = function (key) {
        var clone = this.clone_();
        clone.headers_.delete(key);
        return clone;
    };
    HttpHeaders.prototype.forEach = function (callback, thisArg) {
        var _this = this;
        this.headers_.forEach(function (v, k) {
            callback(v.join(', '), k, _this);
        });
    };
    HttpHeaders.prototype.serialize = function () {
        var headers = [];
        this.forEach(function (value, key) {
            headers.push([key, value]);
        });
        return headers;
    };
    HttpHeaders.prototype.toObject = function () {
        var headers = {};
        this.forEach(function (value, key) {
            headers[key] = value;
        });
        return headers;
    };
    HttpHeaders.prototype.clone_ = function () {
        var clone = new HttpHeaders();
        this.headers_.forEach(function (value, key) {
            clone.headers_.set(key, value);
        });
        return clone;
    };
    return HttpHeaders;
}());
exports.HttpHeaders = HttpHeaders;
