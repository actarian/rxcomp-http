"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpParams = void 0;
var http_params_encoder_1 = require("./http-params.encoder");
var HttpParams = /** @class */ (function () {
    function HttpParams(options, encoder) {
        if (encoder === void 0) { encoder = new http_params_encoder_1.HttpUrlEncodingCodec(); }
        this.params_ = new Map();
        // console.log('HttpParams', encoder);
        this.encoder = encoder;
        var params = this.params_;
        if (options instanceof HttpParams) {
            options.params_.forEach(function (value, key) {
                params.set(key, value);
            });
        }
        else if (typeof options === 'object') {
            Object.keys(options).forEach(function (key) {
                var value = options[key];
                params.set(key, Array.isArray(value) ? value : [value]);
            });
        }
        else if (typeof options === 'string') {
            http_params_encoder_1.parseRawParams_(params, options, this.encoder);
        }
        // ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D
    }
    HttpParams.prototype.keys = function () {
        return Array.from(this.params_.keys());
    };
    HttpParams.prototype.has = function (key) {
        return this.params_.has(key);
    };
    HttpParams.prototype.get = function (key) {
        var value = this.params_.get(key);
        return value ? value[0] : null;
    };
    HttpParams.prototype.getAll = function (key) {
        return this.params_.get(key) || null;
    };
    HttpParams.prototype.set = function (key, value) {
        var clone = this.clone_();
        clone.params_.set(key, [value]);
        return clone;
    };
    HttpParams.prototype.append = function (key, value) {
        var clone = this.clone_();
        if (clone.has(key)) {
            var values = clone.params_.get(key) || [];
            values.push(value);
            clone.params_.set(key, values);
        }
        else {
            clone.params_.set(key, [value]);
        }
        return clone;
    };
    HttpParams.prototype.delete = function (key) {
        var clone = this.clone_();
        clone.params_.delete(key);
        return clone;
    };
    HttpParams.prototype.toString = function () {
        var _this = this;
        return this.keys().map(function (key) {
            var values = _this.params_.get(key);
            var keyValue = _this.encoder.encodeKey(key) + (values ? '=' + values.map(function (x) { return _this.encoder.encodeValue(x); }).join('&') : '');
            // console.log(key, values, keyValue, this.encoder);
            return keyValue;
        }).filter(function (keyValue) { return keyValue !== ''; }).join('&');
    };
    HttpParams.prototype.toObject = function () {
        var _this = this;
        var params = {};
        this.keys().map(function (key) {
            var values = _this.params_.get(key);
            if (values) {
                params[key] = values;
            }
            // return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');
        });
        return params;
    };
    HttpParams.prototype.clone_ = function () {
        var clone = new HttpParams(undefined, this.encoder);
        this.params_.forEach(function (value, key) {
            clone.params_.set(key, value);
        });
        return clone;
    };
    return HttpParams;
}());
exports.HttpParams = HttpParams;
