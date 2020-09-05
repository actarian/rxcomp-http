"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpXhrHandler = void 0;
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var http_error_response_1 = require("./http-error-response");
var http_event_1 = require("./http-event");
var http_headers_1 = require("./http-headers");
var http_response_1 = require("./http-response");
var XSSI_PREFIX = /^\)\]\}',?\n/;
var HttpXhrHandler = /** @class */ (function () {
    function HttpXhrHandler() {
    }
    HttpXhrHandler.prototype.handle = function (request) {
        if (!request.method) {
            throw new Error("missing method");
        }
        if (request.method === 'JSONP') {
            throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");
        }
        // console.log('HttpXhrHandler.request', request);
        return new rxjs_1.Observable(function (observer) {
            var xhr = new XMLHttpRequest();
            var requestInfo = request.urlWithParams;
            var requestInit = request.toInitRequest();
            if (!requestInit.method) {
                throw new Error("missing method");
            }
            // hydrate
            var stateKey = rxcomp_1.TransferService.makeKey(request.transferKey);
            if (rxcomp_1.isPlatformBrowser && request.hydrate && rxcomp_1.TransferService.has(stateKey)) {
                var cached = rxcomp_1.TransferService.get(stateKey); // !!! <T>
                rxcomp_1.TransferService.remove(stateKey);
                observer.next(cached);
                observer.complete();
                return;
                // hydrate
            }
            else {
                xhr.open(requestInit.method, requestInfo);
                if (request.withCredentials) {
                    xhr.withCredentials = true;
                }
                var headers = request.headers;
                if (!headers.has('Accept')) {
                    headers.set('Accept', 'application/json, text/plain, */*');
                }
                if (!headers.has('Content-Type')) {
                    var detectedType = request.detectContentTypeHeader();
                    if (detectedType !== null) {
                        headers.set('Content-Type', detectedType);
                    }
                }
                // console.log('HttpXhrHandler.contentType', headers.get('Content-Type'));
                headers.forEach(function (value, name) { return xhr.setRequestHeader(name, value); });
                if (request.responseType) {
                    xhr.responseType = (request.responseType !== 'json' ? request.responseType : 'text');
                }
                var body_1 = request.serializeBody();
                var headerResponse_1 = null;
                var partialFromXhr_1 = function () {
                    if (headerResponse_1 !== null) {
                        return headerResponse_1;
                    }
                    var status = xhr.status === 1223 ? 204 : xhr.status;
                    var statusText = xhr.statusText || 'OK';
                    var headers = new http_headers_1.HttpHeaders(xhr.getAllResponseHeaders());
                    var url = getResponseUrl_(xhr) || request.url;
                    headerResponse_1 = new http_response_1.HttpHeaderResponse({ headers: headers, status: status, statusText: statusText, url: url });
                    return headerResponse_1;
                };
                var onLoad_1 = function () {
                    var _a = partialFromXhr_1(), headers = _a.headers, status = _a.status, statusText = _a.statusText, url = _a.url;
                    var body = null;
                    if (status !== 204) {
                        body = (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
                    }
                    if (status === 0) {
                        status = !!body ? 200 : 0;
                    }
                    var ok = status >= 200 && status < 300;
                    if (request.responseType === 'json' && typeof body === 'string') {
                        var originalBody = body;
                        body = body.replace(XSSI_PREFIX, '');
                        try {
                            body = body !== '' ? JSON.parse(body) : null;
                        }
                        catch (error) {
                            body = originalBody;
                            if (ok) {
                                ok = false;
                                body = { error: error, text: body };
                            }
                        }
                    }
                    if (ok) {
                        var response = new http_response_1.HttpResponse({ body: body, headers: headers, status: status, statusText: statusText, url: url });
                        // hydrate
                        if (rxcomp_1.isPlatformServer && request.hydrate) {
                            rxcomp_1.TransferService.set(stateKey, response);
                        }
                        // hydrate
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        var options = {
                            error: new Error(statusText),
                            headers: headers,
                            status: status,
                            statusText: statusText,
                            url: url,
                            request: request
                        };
                        var httpErrorResponse = new http_error_response_1.HttpErrorResponse(options);
                        // console.log('httpErrorResponse', httpErrorResponse);
                        rxcomp_1.nextError$.next(httpErrorResponse);
                        // return of(null);
                        observer.error(httpErrorResponse);
                    }
                };
                var onError_1 = function (error) {
                    var url = partialFromXhr_1().url;
                    var statusText = xhr.statusText || 'Unknown Error';
                    var headers = new http_headers_1.HttpHeaders(xhr.getAllResponseHeaders());
                    var options = {
                        error: new Error(statusText),
                        headers: headers,
                        status: xhr.status || 0,
                        statusText: statusText,
                        url: url,
                        request: request
                    };
                    var httpErrorResponse = new http_error_response_1.HttpErrorResponse(options);
                    // console.log('httpErrorResponse', httpErrorResponse);
                    rxcomp_1.nextError$.next(httpErrorResponse);
                    // return of(null);
                    observer.error(httpErrorResponse);
                };
                var sentHeaders_1 = false;
                var onDownloadProgress_1 = function (event) {
                    if (!sentHeaders_1) {
                        observer.next(partialFromXhr_1());
                        sentHeaders_1 = true;
                    }
                    var progressEvent = {
                        type: http_event_1.HttpEventType.DownloadProgress,
                        loaded: event.loaded,
                    };
                    if (event.lengthComputable) {
                        progressEvent.total = event.total;
                    }
                    if (request.responseType === 'text' && !!xhr.responseText) {
                        progressEvent.partialText = xhr.responseText;
                    }
                    // console.log('HttpXhrHandler.onDownloadProgress', progressEvent);
                    observer.next(progressEvent);
                };
                var onUpProgress_1 = function (event) {
                    var progress = {
                        type: http_event_1.HttpEventType.UploadProgress,
                        loaded: event.loaded,
                    };
                    if (event.lengthComputable) {
                        progress.total = event.total;
                    }
                    observer.next(progress);
                };
                xhr.addEventListener('load', onLoad_1);
                xhr.addEventListener('error', onError_1);
                if (request.reportProgress) {
                    xhr.addEventListener('progress', onDownloadProgress_1);
                    if (body_1 !== null && xhr.upload) {
                        xhr.upload.addEventListener('progress', onUpProgress_1);
                    }
                }
                xhr.send(body_1);
                observer.next({ type: http_event_1.HttpEventType.Sent });
                return function () {
                    xhr.removeEventListener('error', onError_1);
                    xhr.removeEventListener('load', onLoad_1);
                    if (request.reportProgress) {
                        xhr.removeEventListener('progress', onDownloadProgress_1);
                        if (body_1 !== null && xhr.upload) {
                            xhr.upload.removeEventListener('progress', onUpProgress_1);
                        }
                    }
                    if (xhr.readyState !== xhr.DONE) {
                        xhr.abort();
                    }
                };
            }
        });
    };
    return HttpXhrHandler;
}());
exports.HttpXhrHandler = HttpXhrHandler;
function getResponseUrl_(xhr) {
    if ('responseURL' in xhr && xhr.responseURL) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return null;
}
