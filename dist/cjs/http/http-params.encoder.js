"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRawParams_ = exports.HttpSerializerCodec = exports.HttpUrlEncodingCodec = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var HttpUrlEncodingCodec = /** @class */ (function () {
    function HttpUrlEncodingCodec() {
    }
    HttpUrlEncodingCodec.prototype.encodeKey = function (key) {
        return encodeParam_(key);
    };
    HttpUrlEncodingCodec.prototype.decodeKey = function (key) {
        return decodeURIComponent(key);
    };
    HttpUrlEncodingCodec.prototype.encodeValue = function (value) {
        return encodeParam_(value);
    };
    HttpUrlEncodingCodec.prototype.decodeValue = function (value) {
        return decodeURIComponent(value);
    };
    return HttpUrlEncodingCodec;
}());
exports.HttpUrlEncodingCodec = HttpUrlEncodingCodec;
var HttpSerializerCodec = /** @class */ (function () {
    function HttpSerializerCodec() {
    }
    HttpSerializerCodec.prototype.encodeKey = function (key) {
        return encodeParam_(key);
    };
    HttpSerializerCodec.prototype.decodeKey = function (key) {
        return decodeURIComponent(key);
    };
    HttpSerializerCodec.prototype.encodeValue = function (value) {
        // console.log('encodeValue', value);
        return rxcomp_1.Serializer.encode(value, [rxcomp_1.encodeJson, encodeURIComponent, rxcomp_1.encodeBase64]) || '';
    };
    HttpSerializerCodec.prototype.decodeValue = function (value) {
        // console.log('decodeValue', value);
        return rxcomp_1.Serializer.decode(value, [rxcomp_1.decodeBase64, decodeURIComponent, rxcomp_1.decodeJson]) || '';
    };
    return HttpSerializerCodec;
}());
exports.HttpSerializerCodec = HttpSerializerCodec;
function parseRawParams_(params, queryString, encoder) {
    if (queryString.length > 0) {
        var keyValueParams = queryString.split('&');
        keyValueParams.forEach(function (keyValue) {
            var index = keyValue.indexOf('=');
            var _a = tslib_1.__read(index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))], 2), key = _a[0], value = _a[1];
            var values = params.get(key) || [];
            values.push(value);
            params.set(key, values);
        });
    }
    return params;
}
exports.parseRawParams_ = parseRawParams_;
function encodeParam_(value) {
    return encodeURIComponent(value)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/gi, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%2B/gi, '+')
        .replace(/%3D/gi, '=')
        .replace(/%3F/gi, '?')
        .replace(/%2F/gi, '/');
}
