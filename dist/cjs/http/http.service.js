"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var http_error_response_1 = require("./http-error-response");
var http_headers_1 = require("./http-headers");
var http_interceptor_1 = require("./http-interceptor");
var http_params_1 = require("./http-params");
var http_request_1 = require("./http-request");
var http_response_1 = require("./http-response");
var HttpService = /** @class */ (function () {
    function HttpService() {
    }
    HttpService.incrementPendingRequest = function () {
        HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
    };
    HttpService.decrementPendingRequest = function () {
        HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
    };
    HttpService.request$ = function (first, url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var request;
        if (first instanceof http_request_1.HttpRequest) {
            request = first;
        }
        else {
            var headers = undefined;
            if (options.headers instanceof http_headers_1.HttpHeaders) {
                headers = options.headers;
            }
            else {
                headers = new http_headers_1.HttpHeaders(options.headers);
            }
            var params = undefined;
            if (options.params) {
                params = new http_params_1.HttpParams(options.params, options.paramsEncoder);
            }
            request = new http_request_1.HttpRequest(first, url, (options.body !== undefined ? options.body : null), {
                headers: headers,
                params: params,
                reportProgress: options.reportProgress,
                responseType: options.responseType || 'json',
                withCredentials: options.withCredentials,
            });
        }
        // console.log('HttpService.request$', request);
        HttpService.incrementPendingRequest();
        var events$ = rxjs_1.of(request).pipe(operators_1.concatMap(function (request) { return _this.handler.handle(request); }), 
        // tap((response: HttpEvent<any>) => {
        // console.log('HttpService.response', response)
        // ),
        operators_1.finalize(function () { return HttpService.decrementPendingRequest(); }));
        if (first instanceof http_request_1.HttpRequest || options.observe === 'events') {
            return events$.pipe(operators_1.catchError(function (error) {
                console.log('error', error);
                return rxjs_1.throwError(_this.getError(error, null, request));
            }));
        }
        var response$ = events$.pipe(operators_1.filter(function (event) { return event instanceof http_response_1.HttpResponse; }));
        var response_;
        var observe$ = response$.pipe(operators_1.map(function (response) {
            response_ = response;
            switch (options.observe || 'body') {
                case 'body':
                    switch (request.responseType) {
                        case 'arraybuffer':
                            if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                                throw new Error('Response is not an ArrayBuffer.');
                            }
                            return response.body;
                        case 'blob':
                            if (response.body !== null && !(response.body instanceof Blob)) {
                                throw new Error('Response is not a Blob.');
                            }
                            return response.body;
                        case 'text':
                            if (response.body !== null && typeof response.body !== 'string') {
                                throw new Error('Response is not a string.');
                            }
                            return response.body;
                        case 'json':
                        default:
                            return response.body;
                    }
                case 'response':
                    return response;
                default:
                    throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
            }
        }), operators_1.catchError(function (error) {
            console.log('error', error);
            return rxjs_1.throwError(_this.getError(error, response_, request));
        }));
        return observe$;
        /*
        switch (options.observe || 'body') {
            case 'body':
                switch (request.responseType) {
                    case 'arraybuffer':
                        return response$.pipe(map((response: HttpResponse<T>) => {
                            if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                                throw new Error('Response is not an ArrayBuffer.');
                            }
                            return response.body;
                        }));
                    case 'blob':
                        return response$.pipe(map((response: HttpResponse<T>) => {
                            if (response.body !== null && !(response.body instanceof Blob)) {
                                throw new Error('Response is not a Blob.');
                            }
                            return response.body;
                        }));
                    case 'text':
                        return response$.pipe(map((response: HttpResponse<T>) => {
                            if (response.body !== null && typeof response.body !== 'string') {
                                throw new Error('Response is not a string.');
                            }
                            return response.body;
                        }));
                    case 'json':
                    default:
                        return response$.pipe(map((response: HttpResponse<T>) => response.body));
                }
            case 'response':
                return response$;
            default:
                throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
        }
        */
    };
    HttpService.delete$ = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request$('DELETE', url, options);
    };
    HttpService.get$ = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request$('GET', url, options);
    };
    HttpService.head$ = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request$('HEAD', url, options);
    };
    HttpService.jsonp$ = function (url, callbackParam) {
        return this.request$('JSONP', url, {
            params: new http_params_1.HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
            observe: 'body',
            responseType: 'json',
        });
    };
    HttpService.options$ = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request$('OPTIONS', url, options);
    };
    HttpService.patch$ = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request$('PATCH', url, optionsWithBody_(options, body));
    };
    HttpService.post$ = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request$('POST', url, optionsWithBody_(options, body));
    };
    HttpService.put$ = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request$('PUT', url, optionsWithBody_(options, body));
    };
    HttpService.getError = function (error, response, request) {
        if (!error.status) {
            error.statusCode = (response === null || response === void 0 ? void 0 : response.status) || 0;
        }
        if (!error.statusMessage) {
            error.statusMessage = (response === null || response === void 0 ? void 0 : response.statusText) || 'Unknown Error';
        }
        var options = {
            error: error,
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            request: request,
        };
        if (response) {
            options.headers = response.headers;
            options.status = options.status || response.status;
            options.statusText = options.statusText || response.statusText;
            options.url = response.url;
        }
        return new http_error_response_1.HttpErrorResponse(options);
    };
    HttpService.pendingRequests$ = new rxjs_1.BehaviorSubject(0);
    // static handler: HttpHandler = new HttpFetchHandler();
    HttpService.handler = new http_interceptor_1.HttpInterceptingHandler();
    return HttpService;
}());
exports.default = HttpService;
function optionsWithBody_(options, body) {
    return Object.assign({}, options, { body: body });
}
