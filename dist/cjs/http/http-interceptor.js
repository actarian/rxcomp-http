"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonpCallbackContext = exports.interceptingHandler = exports.HttpInterceptingHandler = exports.xhrHandler = exports.fetchHandler = exports.NoopInterceptor = exports.HttpInterceptors = exports.HttpInterceptorHandler = void 0;
var http_fetch_handler_1 = require("./http-fetch.handler");
var http_xhr_handler_1 = require("./http-xhr.handler");
var HttpInterceptorHandler = /** @class */ (function () {
    function HttpInterceptorHandler(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
    }
    HttpInterceptorHandler.prototype.handle = function (req) {
        return this.interceptor.intercept(req, this.next);
    };
    return HttpInterceptorHandler;
}());
exports.HttpInterceptorHandler = HttpInterceptorHandler;
exports.HttpInterceptors = [];
var NoopInterceptor = /** @class */ (function () {
    function NoopInterceptor() {
    }
    NoopInterceptor.prototype.intercept = function (req, next) {
        return next.handle(req);
    };
    return NoopInterceptor;
}());
exports.NoopInterceptor = NoopInterceptor;
exports.fetchHandler = new http_fetch_handler_1.HttpFetchHandler();
exports.xhrHandler = new http_xhr_handler_1.HttpXhrHandler();
var HttpInterceptingHandler = /** @class */ (function () {
    function HttpInterceptingHandler() {
        this.chain = null;
    }
    HttpInterceptingHandler.prototype.handle = function (req) {
        if (this.chain === null) {
            var interceptors = exports.HttpInterceptors;
            this.chain = interceptors.reduceRight(function (next, interceptor) { return new HttpInterceptorHandler(next, interceptor); }, exports.fetchHandler);
        }
        return this.chain.handle(req);
    };
    return HttpInterceptingHandler;
}());
exports.HttpInterceptingHandler = HttpInterceptingHandler;
function interceptingHandler(handler, interceptors) {
    if (interceptors === void 0) { interceptors = []; }
    if (!interceptors) {
        return handler;
    }
    return interceptors.reduceRight(function (next, interceptor) { return new HttpInterceptorHandler(next, interceptor); }, handler);
}
exports.interceptingHandler = interceptingHandler;
function jsonpCallbackContext() {
    if (typeof window === 'object') {
        return window;
    }
    return {};
}
exports.jsonpCallbackContext = jsonpCallbackContext;
