"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpFetchHandler = void 0;
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var http_error_response_1 = require("./http-error-response");
var http_response_1 = require("./http-response");
var HttpFetchHandler = /** @class */ (function () {
    function HttpFetchHandler() {
        this.response_ = null;
    }
    HttpFetchHandler.prototype.handle = function (request) {
        var _this = this;
        if (!request.method) {
            throw new Error("missing method");
        }
        var requestInfo = request.urlWithParams;
        var requestInit = request.toInitRequest();
        // console.log('fetchRequest', fetchRequest);
        // fetchRequest.headers.forEach((value, key) => {
        // console.log('HttpFetchHandler.handle', key, value);
        // });
        // request = request.clone({ headers: fetchRequest.headers });
        // console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);
        // hydrate
        var stateKey = rxcomp_1.TransferService.makeKey(request.transferKey);
        // console.log('HttpFetchHandler.get', 'stateKey', stateKey, 'isPlatformBrowser', isPlatformBrowser, 'hydrate', request.hydrate);
        var response;
        if (rxcomp_1.isPlatformBrowser && request.hydrate && rxcomp_1.TransferService.has(stateKey)) {
            var transfer = rxcomp_1.TransferService.get(stateKey);
            if (transfer) {
                response = new http_response_1.HttpResponse(transfer);
            }
            // console.log('HttpFetchHandler', cached);
            rxcomp_1.TransferService.remove(stateKey);
        }
        // hydrate
        if (response) {
            return rxjs_1.of(response);
        }
        else {
            return rxjs_1.from(fetch(requestInfo, requestInit)
                // fetch(fetchRequest)
                .then(function (response) { return _this.getProgress(response, request); })
                .then(function (response) { return _this.getResponse(response, request); })).pipe(
            // hydrate
            operators_1.tap(function (response) {
                // console.log('HttpFetchHandler.set', 'isPlatformServer', isPlatformServer, 'hydrate', request.hydrate, response);
                if (rxcomp_1.isPlatformServer && request.hydrate) {
                    rxcomp_1.TransferService.set(stateKey, response.toObject());
                }
            }), 
            // hydrate
            operators_1.catchError(function (error) {
                var errorResponse = { error: error };
                if (_this.response_) {
                    errorResponse.headers = _this.response_.headers;
                    errorResponse.status = _this.response_.status;
                    errorResponse.statusText = _this.response_.statusText;
                    errorResponse.url = _this.response_.url;
                    errorResponse.request = request;
                }
                var httpErrorResponse = new http_error_response_1.HttpErrorResponse(errorResponse);
                // console.log('httpErrorResponse', httpErrorResponse);
                rxcomp_1.nextError$.next(httpErrorResponse);
                return rxjs_1.of(_this.response_);
                // return throwError(httpErrorResponse);
            }), operators_1.finalize(function () {
                _this.response_ = null;
            }));
        }
    };
    HttpFetchHandler.prototype.getProgress = function (response, request) {
        var _this = this;
        // console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);
        var clonedBody = response.clone().body;
        if (rxcomp_1.isPlatformBrowser && request.reportProgress && clonedBody) {
            var reader_1 = clonedBody.getReader();
            var contentLength_1 = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
            return new Promise(function (resolve, reject) {
                /*
                let receivedLength = 0; // received that many bytes at the moment
                const chunks: Uint8Array[] = []; // array of received binary chunks (comprises the body)
                const getChunk = () => {
                    return reader.read().then(({ done, value }) => {
                        if (!done) {
                            if (value) {
                                chunks.push(value);
                                receivedLength += value.length || 0;
                                // console.log(`HttpFetchHandler.setProgress ${(receivedLength / contentLength * 100).toFixed(2)}% ${receivedLength} of ${contentLength}`);
                            }
                            getChunk();
                        } else {
                            reader.cancel();
                            resolve(response);
                            if (false) {
                                // Step 4: concatenate chunks into single Uint8Array
                                const chunksAll = new Uint8Array(receivedLength); // (4.1)
                                let position = 0;
                                for (let chunk of chunks) {
                                    chunksAll.set(chunk, position); // (4.2)
                                    position += chunk.length;
                                }
                                // Step 5: decode into a string
                                const result = new TextDecoder("utf-8").decode(chunksAll);
                                // We're done!
                                const data = JSON.parse(result);
                                // console.log('HttpFetchHandler.setProgress data', data);
                                resolve(response);
                            }
                        }
                    }).catch(error => {
                        reader.cancel();
                        reject(error);
                    });
                };
                getChunk();
                */
                var progress = { progress: 0, percent: 0, current: 0, total: 0 };
                var onProgress = function (value, done) {
                    var receivedLength = progress.current;
                    if (!done) {
                        if (value) {
                            receivedLength += value.length || 0;
                            progress.total = contentLength_1;
                            progress.current = receivedLength;
                            progress.progress = receivedLength / contentLength_1;
                            progress.percent = progress.progress * 100;
                        }
                        // console.log('progress', progress);
                        return reader_1.read().then(function (_a) {
                            var value = _a.value, done = _a.done;
                            return onProgress(value, done);
                        });
                    }
                    else {
                        progress.total = contentLength_1;
                        progress.current = contentLength_1;
                        progress.progress = 1;
                        progress.percent = 100;
                        // console.log('progress', progress);
                        return reader_1.closed.then(function () { return response.clone(); });
                    }
                };
                reader_1.read()
                    .then(function (_a) {
                    var value = _a.value, done = _a.done;
                    return onProgress(value, done);
                })
                    .then(function (response) {
                    _this.response_ = new http_response_1.HttpResponse(response);
                    if (typeof response[request.responseType] === 'function') {
                        return response[request.responseType]().then(function (json) {
                            _this.response_ = new http_response_1.HttpResponse(Object.assign(_this.response_, { body: json }));
                            if (response.ok) {
                                return resolve(_this.response_);
                            }
                            else {
                                return reject(_this.response_);
                            }
                        });
                    }
                    else {
                        return reject(_this.response_);
                    }
                })
                    .catch(function (err) { return console.log("upload error:", err); });
            });
        }
        else {
            return Promise.resolve(response);
        }
    };
    HttpFetchHandler.prototype.getResponse = function (response, request) {
        this.response_ = new http_response_1.HttpResponse(response);
        if (rxcomp_1.isPlatformBrowser && request.reportProgress && response.body) {
            return Promise.resolve(this.response_);
        }
        else {
            return this.getResponseType(response, request);
        }
    };
    HttpFetchHandler.prototype.getResponseType = function (response, request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.response_ = new http_response_1.HttpResponse(response);
            if (typeof response[request.responseType] === 'function') {
                return response[request.responseType]().then(function (json) {
                    _this.response_ = new http_response_1.HttpResponse(Object.assign(_this.response_, { body: json }));
                    if (response.ok) {
                        return resolve(_this.response_);
                    }
                    else {
                        return reject(_this.response_);
                    }
                });
            }
            else {
                return reject(_this.response_);
            }
        });
    };
    HttpFetchHandler.prototype.getReadableStream = function (response, request) {
        var reader = response.body.getReader();
        var readableStream = new ReadableStream({
            start: function (controller) {
                // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
                // controller.enqueue(request.bodyUsed);
                // The following function handles each data chunk
                var push = function () {
                    // "done" is a Boolean and value a "Uint8Array"
                    reader.read().then(function (_a) {
                        var done = _a.done, value = _a.value;
                        // Is there no more data to read?
                        if (done) {
                            // Tell the browser that we have finished sending data
                            controller.close();
                            return;
                        }
                        // Get the data and send it to the browser via the controller
                        controller.enqueue(value);
                        push();
                    });
                };
                push();
            },
        });
        return readableStream;
    };
    return HttpFetchHandler;
}());
exports.HttpFetchHandler = HttpFetchHandler;
/*
    onProgress(value: Uint8Array, done: boolean, request, reader, progress) {
        // console.log("value:", value);
        if (value || done) {
            // console.log("upload complete, request.bodyUsed:", request.bodyUsed);
            progress.value = progress.max;
            return reader.closed.then(() => fileUpload);
        };
        // console.log("upload progress:", value);
        if (progress.value < file.size) {
            progress.value += 1;
        }
        return reader.read().then(({ value, done }) => this.onProgress(value, done, request, reader, progress));
    }
    */
/*
getProgress_(request) {
    const uploadProgress = new ReadableStream({
        start(controller) {
            // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
            controller.enqueue(request.bodyUsed);
        },
        pull(controller) {
            if (request.bodyUsed) {
                controller.close();
            }
            controller.enqueue(request.bodyUsed);
            // console.log("pull, request.bodyUsed:", request.bodyUsed);
        },
        cancel(reason) {
            // console.log(reason);
        }
    });
    const [fileUpload, reader] = [
        upload(request).catch(e => {
            reader.cancel();
            // console.log(e);
            throw e
        }), uploadProgress.getReader()
    ];
}
*/
