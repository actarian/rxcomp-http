/**
 * @license rxcomp-http v1.0.0-beta.18
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('rxcomp'),require('rxjs'),require('rxjs/operators')):typeof define==='function'&&define.amd?define(['exports','rxcomp','rxjs','rxjs/operators'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.rxcomp=g.rxcomp||{},g.rxcomp.http={}),g.rxcomp,g.rxjs,g.rxjs.operators));}(this,(function(exports, rxcomp, rxjs, operators){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}(function (HttpEventType) {
  HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
  HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType[HttpEventType["Response"] = 4] = "Response";
  HttpEventType[HttpEventType["User"] = 5] = "User";
  HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(exports.HttpEventType || (exports.HttpEventType = {}));var HttpHeaders = /*#__PURE__*/function () {
  function HttpHeaders(options) {
    var _this = this;

    this.headers_ = new Map();
    var headers = this.headers_;

    if (options instanceof HttpHeaders) {
      options.headers_.forEach(function (value, key) {
        headers.set(key, value);
      });
    } else if (typeof (options == null ? void 0 : options.forEach) === 'function') {
      options.forEach(function (value, key) {
        headers.set(key, value.split(', '));
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var values = options[key];

        if (typeof values === 'string') {
          values = [values];
        }

        if (headers.has(key)) {
          values.forEach(function (value) {
            return _this.append(key, value);
          });
        } else {
          headers.set(key, values);
        }
      });
    } else if (typeof options === 'string') {
      options.split('\n').forEach(function (line) {
        var index = line.indexOf(':');

        if (index > 0) {
          var key = line.slice(0, index);
          var value = line.slice(index + 1).trim();

          if (headers.has(key)) {
            _this.append(key, value);
          } else {
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

  var _proto = HttpHeaders.prototype;

  _proto.has = function has(key) {
    return this.headers_.has(key);
  };

  _proto.get = function get(key) {
    var values = this.headers_.get(key);
    return values ? values.join(', ') : null;
  };

  _proto.set = function set(key, value) {
    var clone = this.clone_();
    clone.headers_.set(key, value.split(', '));
    return clone;
  };

  _proto.append = function append(key, value) {
    var clone = this.clone_();
    var values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
    values.push(value);
    clone.headers_.set(key, values);
    return clone;
  };

  _proto.delete = function _delete(key) {
    var clone = this.clone_();
    clone.headers_.delete(key);
    return clone;
  };

  _proto.forEach = function forEach(callback, thisArg) {
    var _this2 = this;

    this.headers_.forEach(function (v, k) {
      callback(v.join(', '), k, _this2);
    });
  };

  _proto.serialize = function serialize() {
    var headers = [];
    this.forEach(function (value, key) {
      headers.push([key, value]);
    });
    return headers;
  };

  _proto.toObject = function toObject() {
    var headers = {};
    this.forEach(function (value, key) {
      headers[key] = value;
    });
    return headers;
  };

  _proto.clone_ = function clone_() {
    var clone = new HttpHeaders();
    this.headers_.forEach(function (value, key) {
      clone.headers_.set(key, value);
    });
    return clone;
  };

  return HttpHeaders;
}();var HttpErrorResponse = /*#__PURE__*/function (_Error) {
  _inheritsLoose(HttpErrorResponse, _Error);

  function HttpErrorResponse(options) {
    var _this;

    _this = _Error.call(this, (options == null ? void 0 : options.message) || 'Unknown Error') || this;
    _this.status = 0;
    _this.statusText = 'Unknown Error';
    _this.ok = false;
    _this.type = exports.HttpEventType.ResponseError;
    _this.message = 'Unknown Error';
    _this.name = 'HttpErrorResponse';

    if (options) {
      _this.headers = new HttpHeaders(options.headers);
      _this.status = options.status || _this.status;
      _this.statusText = options.statusText || _this.statusText;
      _this.url = options.url || _this.url;
      _this.error = options.error || _this.error;
      _this.name = options.name || _this.name;
      _this.request = options.request || null;
    }

    return _this;
  }

  var _proto = HttpErrorResponse.prototype;

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      error: this.error,
      message: this.message,
      name: this.name,
      request: this.request
    }, options || {});
    var clone = new HttpErrorResponse(options);
    return clone;
  };

  return HttpErrorResponse;
}( /*#__PURE__*/_wrapNativeSuper(Error));var HttpHeaderResponse = /*#__PURE__*/function () {
  function HttpHeaderResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = exports.HttpEventType.ResponseHeader;

    if (options) {
      this.headers = new HttpHeaders(options.headers);
      this.status = options.status || this.status;
      this.statusText = options.statusText || this.statusText;
      this.url = options.url || this.url;
    }

    this.ok = this.status >= 200 && this.status < 300;
  }

  var _proto = HttpHeaderResponse.prototype;

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      ok: this.ok,
      type: this.type
    }, options || {});
    var clone = new HttpHeaderResponse(options);
    return clone;
  };

  return HttpHeaderResponse;
}();
var HttpResponse = /*#__PURE__*/function () {
  function HttpResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = exports.HttpEventType.Response;
    this.body = null;

    if (options) {
      this.headers = new HttpHeaders(options.headers);
      this.status = options.status || this.status;
      this.statusText = options.statusText || this.statusText;
      this.url = options.url || this.url;
      this.body = options.body || this.body;
    }

    this.ok = this.status >= 200 && this.status < 300;
  }

  var _proto2 = HttpResponse.prototype;

  _proto2.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      ok: this.ok,
      type: this.type,
      body: this.body
    }, options || {});
    var clone = new HttpResponse(options);
    return clone;
  };

  _proto2.toObject = function toObject() {
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
}();
var HttpResponseBase = function HttpResponseBase(options, defaultStatus, defaultStatusText) {
  if (defaultStatus === void 0) {
    defaultStatus = 200;
  }

  if (defaultStatusText === void 0) {
    defaultStatusText = 'OK';
  }

  this.status = 200;
  this.statusText = 'OK';
  this.headers = options.headers || new HttpHeaders();
  this.status = options.status !== undefined ? options.status : defaultStatus;
  this.statusText = options.statusText || defaultStatusText;
  this.url = options.url || undefined;
  this.ok = this.status >= 200 && this.status < 300;
};
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
*/var HttpFetchHandler = /*#__PURE__*/function () {
  function HttpFetchHandler() {
    this.response_ = null;
  }

  var _proto = HttpFetchHandler.prototype;

  _proto.handle = function handle(request) {
    var _this = this;

    if (!request.method) {
      throw new Error("missing method");
    }

    var requestInfo = request.urlWithParams;
    var requestInit = request.toInitRequest(); // console.log('fetchRequest', fetchRequest);
    // fetchRequest.headers.forEach((value, key) => {
    // console.log('HttpFetchHandler.handle', key, value);
    // });
    // request = request.clone({ headers: fetchRequest.headers });
    // console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);
    // hydrate

    var stateKey = rxcomp.TransferService.makeKey(request.transferKey); // console.log('HttpFetchHandler.get', 'stateKey', stateKey, 'isPlatformBrowser', isPlatformBrowser, 'hydrate', request.hydrate);

    var response;

    if (rxcomp.isPlatformBrowser && request.hydrate && rxcomp.TransferService.has(stateKey)) {
      var transfer = rxcomp.TransferService.get(stateKey);

      if (transfer) {
        response = new HttpResponse(transfer);
      } // console.log('HttpFetchHandler', cached);


      rxcomp.TransferService.remove(stateKey);
    } // hydrate


    if (response) {
      return rxjs.of(response);
    } else {
      return rxjs.from(fetch(requestInfo, requestInit) // fetch(fetchRequest)
      .then(function (response) {
        return _this.getProgress(response, request);
      }).then(function (response) {
        return _this.getResponse(response, request);
      })).pipe( // hydrate
      operators.tap(function (response) {
        // console.log('HttpFetchHandler.set', 'isPlatformServer', isPlatformServer, 'hydrate', request.hydrate, response);
        if (rxcomp.isPlatformServer && request.hydrate) {
          rxcomp.TransferService.set(stateKey, response.toObject());
        }
      }), // hydrate
      operators.catchError(function (error) {
        var errorResponse = {
          error: error
        };

        if (_this.response_) {
          errorResponse.headers = _this.response_.headers;
          errorResponse.status = _this.response_.status;
          errorResponse.statusText = _this.response_.statusText;
          errorResponse.url = _this.response_.url;
          errorResponse.request = request;
        }

        var httpErrorResponse = new HttpErrorResponse(errorResponse); // console.log('httpErrorResponse', httpErrorResponse);

        rxcomp.nextError$.next(httpErrorResponse);
        return rxjs.of(_this.response_); // return throwError(httpErrorResponse);
      }), operators.finalize(function () {
        _this.response_ = null;
      }));
    }
  };

  _proto.getProgress = function getProgress(response, request) {
    var _this2 = this;

    // console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);
    var clonedBody = response.clone().body;

    if (rxcomp.isPlatformBrowser && request.reportProgress && clonedBody) {
      var reader = clonedBody.getReader();
      var contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
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
        var progress = {
          progress: 0,
          percent: 0,
          current: 0,
          total: 0
        };

        var onProgress = function onProgress(value, done) {
          var receivedLength = progress.current;

          if (!done) {
            if (value) {
              receivedLength += value.length || 0;
              progress.total = contentLength;
              progress.current = receivedLength;
              progress.progress = receivedLength / contentLength;
              progress.percent = progress.progress * 100;
            } // console.log('progress', progress);


            return reader.read().then(function (_ref) {
              var value = _ref.value,
                  done = _ref.done;
              return onProgress(value, done);
            });
          } else {
            progress.total = contentLength;
            progress.current = contentLength;
            progress.progress = 1;
            progress.percent = 100; // console.log('progress', progress);

            return reader.closed.then(function () {
              return response.clone();
            });
          }
        };

        reader.read().then(function (_ref2) {
          var value = _ref2.value,
              done = _ref2.done;
          return onProgress(value, done);
        }).then(function (response) {
          _this2.response_ = new HttpResponse(response);

          if (typeof response[request.responseType] === 'function') {
            return response[request.responseType]().then(function (json) {
              _this2.response_ = new HttpResponse(Object.assign(_this2.response_, {
                body: json
              }));

              if (response.ok) {
                return resolve(_this2.response_);
              } else {
                return reject(_this2.response_);
              }
            });
          } else {
            return reject(_this2.response_);
          }
        }).catch(function (err) {
          return console.log("upload error:", err);
        });
      });
    } else {
      return Promise.resolve(response);
    }
  };

  _proto.getResponse = function getResponse(response, request) {
    this.response_ = new HttpResponse(response);

    if (rxcomp.isPlatformBrowser && request.reportProgress && response.body) {
      return Promise.resolve(this.response_);
    } else {
      return this.getResponseType(response, request);
    }
  };

  _proto.getResponseType = function getResponseType(response, request) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      _this3.response_ = new HttpResponse(response);

      if (typeof response[request.responseType] === 'function') {
        return response[request.responseType]().then(function (json) {
          _this3.response_ = new HttpResponse(Object.assign(_this3.response_, {
            body: json
          }));

          if (response.ok) {
            return resolve(_this3.response_);
          } else {
            return reject(_this3.response_);
          }
        });
      } else {
        return reject(_this3.response_);
      }
    });
  };

  _proto.getReadableStream = function getReadableStream(response, request) {
    var reader = response.body.getReader();
    var readableStream = new ReadableStream({
      start: function start(controller) {
        // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
        // controller.enqueue(request.bodyUsed);
        // The following function handles each data chunk
        var push = function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(function (_ref3) {
            var done = _ref3.done,
                value = _ref3.value;

            // Is there no more data to read?
            if (done) {
              // Tell the browser that we have finished sending data
              controller.close();
              return;
            } // Get the data and send it to the browser via the controller


            controller.enqueue(value);
            push();
          });
        };

        push();
      }
    });
    return readableStream;
  };

  return HttpFetchHandler;
}();
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
*/var XSSI_PREFIX = /^\)\]\}',?\n/;
var HttpXhrHandler = /*#__PURE__*/function () {
  function HttpXhrHandler() {}

  var _proto = HttpXhrHandler.prototype;

  _proto.handle = function handle(request) {
    if (!request.method) {
      throw new Error("missing method");
    }

    if (request.method === 'JSONP') {
      throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");
    } // console.log('HttpXhrHandler.request', request);


    return new rxjs.Observable(function (observer) {
      var xhr = new XMLHttpRequest();
      var requestInfo = request.urlWithParams;
      var requestInit = request.toInitRequest();

      if (!requestInit.method) {
        throw new Error("missing method");
      } // hydrate


      var stateKey = rxcomp.TransferService.makeKey(request.transferKey);

      if (rxcomp.isPlatformBrowser && request.hydrate && rxcomp.TransferService.has(stateKey)) {
        var cached = rxcomp.TransferService.get(stateKey); // !!! <T>

        rxcomp.TransferService.remove(stateKey);
        observer.next(cached);
        observer.complete();
        return; // hydrate
      } else {
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
        } // console.log('HttpXhrHandler.contentType', headers.get('Content-Type'));


        headers.forEach(function (value, name) {
          return xhr.setRequestHeader(name, value);
        });

        if (request.responseType) {
          xhr.responseType = request.responseType !== 'json' ? request.responseType : 'text';
        }

        var body = request.serializeBody();
        var headerResponse = null;

        var partialFromXhr_ = function partialFromXhr_() {
          if (headerResponse !== null) {
            return headerResponse;
          }

          var status = xhr.status === 1223 ? 204 : xhr.status;
          var statusText = xhr.statusText || 'OK';
          var headers = new HttpHeaders(xhr.getAllResponseHeaders());
          var url = getResponseUrl_(xhr) || request.url;
          headerResponse = new HttpHeaderResponse({
            headers: headers,
            status: status,
            statusText: statusText,
            url: url
          });
          return headerResponse;
        };

        var onLoad = function onLoad() {
          var _partialFromXhr_ = partialFromXhr_(),
              headers = _partialFromXhr_.headers,
              status = _partialFromXhr_.status,
              statusText = _partialFromXhr_.statusText,
              url = _partialFromXhr_.url;

          var body = null;

          if (status !== 204) {
            body = typeof xhr.response === 'undefined' ? xhr.responseText : xhr.response;
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
            } catch (error) {
              body = originalBody;

              if (ok) {
                ok = false;
                body = {
                  error: error,
                  text: body
                };
              }
            }
          }

          if (ok) {
            var response = new HttpResponse({
              body: body,
              headers: headers,
              status: status,
              statusText: statusText,
              url: url
            }); // hydrate

            if (rxcomp.isPlatformServer && request.hydrate) {
              rxcomp.TransferService.set(stateKey, response);
            } // hydrate


            observer.next(response);
            observer.complete();
          } else {
            var options = {
              error: new Error(statusText),
              headers: headers,
              status: status,
              statusText: statusText,
              url: url,
              request: request
            };
            var httpErrorResponse = new HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

            rxcomp.nextError$.next(httpErrorResponse); // return of(null);

            observer.error(httpErrorResponse);
          }
        };

        var onError = function onError(error) {
          var _partialFromXhr_2 = partialFromXhr_(),
              url = _partialFromXhr_2.url;

          var statusText = xhr.statusText || 'Unknown Error';
          var headers = new HttpHeaders(xhr.getAllResponseHeaders());
          var options = {
            error: new Error(statusText),
            headers: headers,
            status: xhr.status || 0,
            statusText: statusText,
            url: url,
            request: request
          };
          var httpErrorResponse = new HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

          rxcomp.nextError$.next(httpErrorResponse); // return of(null);

          observer.error(httpErrorResponse);
        };

        var sentHeaders = false;

        var onDownloadProgress = function onDownloadProgress(event) {
          if (!sentHeaders) {
            observer.next(partialFromXhr_());
            sentHeaders = true;
          }

          var progressEvent = {
            type: exports.HttpEventType.DownloadProgress,
            loaded: event.loaded
          };

          if (event.lengthComputable) {
            progressEvent.total = event.total;
          }

          if (request.responseType === 'text' && !!xhr.responseText) {
            progressEvent.partialText = xhr.responseText;
          } // console.log('HttpXhrHandler.onDownloadProgress', progressEvent);


          observer.next(progressEvent);
        };

        var onUpProgress = function onUpProgress(event) {
          var progress = {
            type: exports.HttpEventType.UploadProgress,
            loaded: event.loaded
          };

          if (event.lengthComputable) {
            progress.total = event.total;
          }

          observer.next(progress);
        };

        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);

        if (request.reportProgress) {
          xhr.addEventListener('progress', onDownloadProgress);

          if (body !== null && xhr.upload) {
            xhr.upload.addEventListener('progress', onUpProgress);
          }
        }

        xhr.send(body);
        observer.next({
          type: exports.HttpEventType.Sent
        });
        return function () {
          xhr.removeEventListener('error', onError);
          xhr.removeEventListener('load', onLoad);

          if (request.reportProgress) {
            xhr.removeEventListener('progress', onDownloadProgress);

            if (body !== null && xhr.upload) {
              xhr.upload.removeEventListener('progress', onUpProgress);
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
}();

function getResponseUrl_(xhr) {
  if ('responseURL' in xhr && xhr.responseURL) {
    return xhr.responseURL;
  }

  if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
    return xhr.getResponseHeader('X-Request-URL');
  }

  return null;
}var HttpInterceptorHandler = /*#__PURE__*/function () {
  function HttpInterceptorHandler(next, interceptor) {
    this.next = next;
    this.interceptor = interceptor;
  }

  var _proto = HttpInterceptorHandler.prototype;

  _proto.handle = function handle(req) {
    return this.interceptor.intercept(req, this.next);
  };

  return HttpInterceptorHandler;
}();
var HttpInterceptors = [];
var NoopInterceptor = /*#__PURE__*/function () {
  function NoopInterceptor() {}

  var _proto2 = NoopInterceptor.prototype;

  _proto2.intercept = function intercept(req, next) {
    return next.handle(req);
  };

  return NoopInterceptor;
}();
var fetchHandler = new HttpFetchHandler();
var xhrHandler = new HttpXhrHandler();
var HttpInterceptingHandler = /*#__PURE__*/function () {
  function HttpInterceptingHandler() {
    this.chain = null;
  }

  var _proto3 = HttpInterceptingHandler.prototype;

  _proto3.handle = function handle(req) {
    if (this.chain === null) {
      var interceptors = HttpInterceptors;
      this.chain = interceptors.reduceRight(function (next, interceptor) {
        return new HttpInterceptorHandler(next, interceptor);
      }, fetchHandler);
    }

    return this.chain.handle(req);
  };

  return HttpInterceptingHandler;
}();
function interceptingHandler(handler, interceptors) {
  if (interceptors === void 0) {
    interceptors = [];
  }

  if (!interceptors) {
    return handler;
  }

  return interceptors.reduceRight(function (next, interceptor) {
    return new HttpInterceptorHandler(next, interceptor);
  }, handler);
}
function jsonpCallbackContext() {
  if (typeof window === 'object') {
    return window;
  }

  return {};
}var factories = [];
var pipes = [];
/**
 *  HttpModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    HttpModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */

var HttpModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(HttpModule, _Module);

  function HttpModule() {
    return _Module.apply(this, arguments) || this;
  }

  HttpModule.useInterceptors = function useInterceptors(interceptorFactories) {
    if (interceptorFactories == null ? void 0 : interceptorFactories.length) {
      var interceptors = interceptorFactories == null ? void 0 : interceptorFactories.map(function (x) {
        return new x();
      });
      HttpInterceptors.push.apply(HttpInterceptors, interceptors);
    }

    return this;
  };

  return HttpModule;
}(rxcomp.Module);
HttpModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var HttpHandler = function HttpHandler() {};var HttpUrlEncodingCodec = /*#__PURE__*/function () {
  function HttpUrlEncodingCodec() {}

  var _proto = HttpUrlEncodingCodec.prototype;

  _proto.encodeKey = function encodeKey(key) {
    return encodeParam_(key);
  };

  _proto.decodeKey = function decodeKey(key) {
    return decodeURIComponent(key);
  };

  _proto.encodeValue = function encodeValue(value) {
    return encodeParam_(value);
  };

  _proto.decodeValue = function decodeValue(value) {
    return decodeURIComponent(value);
  };

  return HttpUrlEncodingCodec;
}();
var HttpSerializerCodec = /*#__PURE__*/function () {
  function HttpSerializerCodec() {}

  var _proto2 = HttpSerializerCodec.prototype;

  _proto2.encodeKey = function encodeKey(key) {
    return encodeParam_(key);
  };

  _proto2.decodeKey = function decodeKey(key) {
    return decodeURIComponent(key);
  };

  _proto2.encodeValue = function encodeValue(value) {
    // console.log('encodeValue', value);
    return rxcomp.Serializer.encode(value, [rxcomp.encodeJson, encodeURIComponent, rxcomp.encodeBase64]) || '';
  };

  _proto2.decodeValue = function decodeValue(value) {
    // console.log('decodeValue', value);
    return rxcomp.Serializer.decode(value, [rxcomp.decodeBase64, decodeURIComponent, rxcomp.decodeJson]) || '';
  };

  return HttpSerializerCodec;
}();
function parseRawParams_(params, queryString, encoder) {
  if (queryString.length > 0) {
    var keyValueParams = queryString.split('&');
    keyValueParams.forEach(function (keyValue) {
      var index = keyValue.indexOf('=');

      var _ref = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))],
          key = _ref[0],
          value = _ref[1];

      var values = params.get(key) || [];
      values.push(value);
      params.set(key, values);
    });
  }

  return params;
}

function encodeParam_(value) {
  return encodeURIComponent(value).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/gi, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%2B/gi, '+').replace(/%3D/gi, '=').replace(/%3F/gi, '?').replace(/%2F/gi, '/');
}var HttpParams = /*#__PURE__*/function () {
  function HttpParams(options, encoder) {
    if (encoder === void 0) {
      encoder = new HttpUrlEncodingCodec();
    }

    this.params_ = new Map(); // console.log('HttpParams', encoder);

    this.encoder = encoder;
    var params = this.params_;

    if (options instanceof HttpParams) {
      options.params_.forEach(function (value, key) {
        params.set(key, value);
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var value = options[key];
        params.set(key, Array.isArray(value) ? value : [value]);
      });
    } else if (typeof options === 'string') {
      parseRawParams_(params, options, this.encoder);
    } // ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D

  }

  var _proto = HttpParams.prototype;

  _proto.keys = function keys() {
    return Array.from(this.params_.keys());
  };

  _proto.has = function has(key) {
    return this.params_.has(key);
  };

  _proto.get = function get(key) {
    var value = this.params_.get(key);
    return value ? value[0] : null;
  };

  _proto.getAll = function getAll(key) {
    return this.params_.get(key) || null;
  };

  _proto.set = function set(key, value) {
    var clone = this.clone_();
    clone.params_.set(key, [value]);
    return clone;
  };

  _proto.append = function append(key, value) {
    var clone = this.clone_();

    if (clone.has(key)) {
      var values = clone.params_.get(key) || [];
      values.push(value);
      clone.params_.set(key, values);
    } else {
      clone.params_.set(key, [value]);
    }

    return clone;
  };

  _proto.delete = function _delete(key) {
    var clone = this.clone_();
    clone.params_.delete(key);
    return clone;
  };

  _proto.toString = function toString() {
    var _this = this;

    return this.keys().map(function (key) {
      var values = _this.params_.get(key);

      var keyValue = _this.encoder.encodeKey(key) + (values ? '=' + values.map(function (x) {
        return _this.encoder.encodeValue(x);
      }).join('&') : ''); // console.log(key, values, keyValue, this.encoder);

      return keyValue;
    }).filter(function (keyValue) {
      return keyValue !== '';
    }).join('&');
  };

  _proto.toObject = function toObject() {
    var _this2 = this;

    var params = {};
    this.keys().map(function (key) {
      var values = _this2.params_.get(key);

      if (values) {
        params[key] = values;
      } // return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');

    });
    return params;
  };

  _proto.clone_ = function clone_() {
    var clone = new HttpParams(undefined, this.encoder);
    this.params_.forEach(function (value, key) {
      clone.params_.set(key, value);
    });
    return clone;
  };

  return HttpParams;
}();var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(method, url, third, fourth) {
    this.url = url;
    this.reportProgress = false;
    this.withCredentials = false;
    this.hydrate = true;
    this.observe = 'body';
    this.responseType = 'json'; // !!! remove, rethink

    var isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
    this.method = isStaticFile ? 'GET' : method.toUpperCase();
    var options;

    if (methodHasBody_(this.method) || !!fourth) {
      this.body = third !== undefined ? third : null;
      options = fourth;
    } else {
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
        this.headers = new HttpHeaders(options.headers);
      }

      if (options.params) {
        this.params = options.params instanceof HttpParams ? options.params : new HttpParams(options.params, options.paramsEncoder);
      }
    }

    if (!this.headers) {
      this.headers = new HttpHeaders();
    }

    if (!this.params) {
      this.params = new HttpParams();
    }

    var params = this.params.toString();
    var index = url.indexOf('?');
    var sep = index === -1 ? '?' : index < url.length - 1 ? '&' : '';
    this.urlWithParams = url + (params.length ? sep + params : params);
  }

  var _proto = HttpRequest.prototype;

  _proto.serializeBody = function serializeBody() {
    if (this.body === null) {
      return null;
    }

    if (isArrayBuffer_(this.body) || isBlob_(this.body) || isFormData_(this.body) || typeof this.body === 'string') {
      return this.body;
    }

    if (this.body instanceof HttpParams) {
      return this.body.toString();
    }

    if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
      return JSON.stringify(this.body);
    }

    return this.body.toString();
  };

  _proto.detectContentTypeHeader = function detectContentTypeHeader() {
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

    if (this.body instanceof HttpParams) {
      return 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    if (typeof this.body === 'object' || typeof this.body === 'number' || Array.isArray(this.body)) {
      return 'application/json';
    }

    return null;
  };

  _proto.toInitRequest = function toInitRequest() {
    return {
      method: this.method,
      headers: this.headers.serialize(),
      body: this.serializeBody(),
      mode: 'same-origin',
      credentials: 'same-origin',
      cache: 'default',
      redirect: 'error'
    };
  };

  _proto.toFetchRequest__ = function toFetchRequest__() {
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

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      reportProgress: this.reportProgress,
      params: this.params,
      responseType: this.responseType,
      withCredentials: this.withCredentials,
      observe: this.observe,
      body: this.body,
      url: this.url,
      method: this.method
    }, options || {});
    var clone = new HttpRequest(this.method, this.url, this.body, options);
    return clone;
  };

  _proto.toObject = function toObject() {
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

  _createClass(HttpRequest, [{
    key: "transferKey",
    get: function get() {
      var pathname = rxcomp.getLocationComponents(this.url).pathname;
      var paramsKey = rxcomp.optionsToKey(this.params.toObject());
      var bodyKey = rxcomp.optionsToKey(this.body);
      var key = this.method + "-" + pathname + "-" + paramsKey + "-" + bodyKey;
      key = key.replace(/(\s+)|(\W+)/g, function () {
        return (arguments.length <= 1 ? undefined : arguments[1]) ? '' : '_';
      }); // console.log('transferKey', key);

      return key;
    }
  }]);

  return HttpRequest;
}();

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
}var HttpService = /*#__PURE__*/function () {
  function HttpService() {}

  HttpService.incrementPendingRequest = function incrementPendingRequest() {
    HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
  };

  HttpService.decrementPendingRequest = function decrementPendingRequest() {
    HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
  };

  HttpService.request$ = function request$(first, url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var request;

    if (first instanceof HttpRequest) {
      request = first;
    } else {
      var headers = undefined;

      if (options.headers instanceof HttpHeaders) {
        headers = options.headers;
      } else {
        headers = new HttpHeaders(options.headers);
      }

      var params = undefined;

      if (options.params) {
        params = new HttpParams(options.params, options.paramsEncoder);
      }

      request = new HttpRequest(first, url, options.body !== undefined ? options.body : null, {
        headers: headers,
        params: params,
        reportProgress: options.reportProgress,
        responseType: options.responseType || 'json',
        withCredentials: options.withCredentials
      });
    } // console.log('HttpService.request$', request);


    HttpService.incrementPendingRequest();
    var events$ = rxjs.of(request).pipe(operators.concatMap(function (request) {
      return _this.handler.handle(request);
    }), // tap((response: HttpEvent<any>) => {
    // console.log('HttpService.response', response)
    // ),
    operators.finalize(function () {
      return HttpService.decrementPendingRequest();
    }));

    if (first instanceof HttpRequest || options.observe === 'events') {
      return events$.pipe(operators.catchError(function (error) {
        console.log('error', error);
        return rxjs.throwError(_this.getError(error, null, request));
      }));
    }

    var response$ = events$.pipe(operators.filter(function (event) {
      return event instanceof HttpResponse;
    }));
    var response_;
    var observe$ = response$.pipe(operators.map(function (response) {
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
    }), operators.catchError(function (error) {
      console.log('error', error);
      return rxjs.throwError(_this.getError(error, response_, request));
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

  HttpService.delete$ = function delete$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('DELETE', url, options);
  };

  HttpService.get$ = function get$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('GET', url, options);
  };

  HttpService.head$ = function head$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('HEAD', url, options);
  };

  HttpService.jsonp$ = function jsonp$(url, callbackParam) {
    return this.request$('JSONP', url, {
      params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
      observe: 'body',
      responseType: 'json'
    });
  };

  HttpService.options$ = function options$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('OPTIONS', url, options);
  };

  HttpService.patch$ = function patch$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PATCH', url, optionsWithBody_(options, body));
  };

  HttpService.post$ = function post$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('POST', url, optionsWithBody_(options, body));
  };

  HttpService.put$ = function put$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PUT', url, optionsWithBody_(options, body));
  };

  HttpService.getError = function getError(error, response, request) {
    if (!error.status) {
      error.statusCode = (response == null ? void 0 : response.status) || 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = (response == null ? void 0 : response.statusText) || 'Unknown Error';
    }

    var options = {
      error: error,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      request: request
    };

    if (response) {
      options.headers = response.headers;
      options.status = options.status || response.status;
      options.statusText = options.statusText || response.statusText;
      options.url = response.url;
    }

    return new HttpErrorResponse(options);
  };

  return HttpService;
}();
HttpService.pendingRequests$ = new rxjs.BehaviorSubject(0); // static handler: HttpHandler = new HttpFetchHandler();

HttpService.handler = new HttpInterceptingHandler();

function optionsWithBody_(options, body) {
  return Object.assign({}, options, {
    body: body
  });
}exports.HttpErrorResponse=HttpErrorResponse;exports.HttpFetchHandler=HttpFetchHandler;exports.HttpHandler=HttpHandler;exports.HttpHeaderResponse=HttpHeaderResponse;exports.HttpHeaders=HttpHeaders;exports.HttpInterceptingHandler=HttpInterceptingHandler;exports.HttpInterceptorHandler=HttpInterceptorHandler;exports.HttpInterceptors=HttpInterceptors;exports.HttpModule=HttpModule;exports.HttpParams=HttpParams;exports.HttpRequest=HttpRequest;exports.HttpResponse=HttpResponse;exports.HttpResponseBase=HttpResponseBase;exports.HttpSerializerCodec=HttpSerializerCodec;exports.HttpService=HttpService;exports.HttpUrlEncodingCodec=HttpUrlEncodingCodec;exports.HttpXhrHandler=HttpXhrHandler;exports.NoopInterceptor=NoopInterceptor;exports.fetchHandler=fetchHandler;exports.interceptingHandler=interceptingHandler;exports.jsonpCallbackContext=jsonpCallbackContext;exports.xhrHandler=xhrHandler;Object.defineProperty(exports,'__esModule',{value:true});})));