/**
 * @license rxcomp-http v1.0.0-beta.14
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,rxjs,operators){'use strict';function _defineProperties(target, props) {
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
}var HttpEventType;

(function (HttpEventType) {
  HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
  HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType[HttpEventType["Response"] = 4] = "Response";
  HttpEventType[HttpEventType["User"] = 5] = "User";
  HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(HttpEventType || (HttpEventType = {}));var HttpHeaders = function () {
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
}();var HttpErrorResponse = function (_Error) {
  _inheritsLoose(HttpErrorResponse, _Error);

  function HttpErrorResponse(options) {
    var _this;

    _this = _Error.call(this, (options == null ? void 0 : options.message) || 'Unknown Error') || this;
    _this.status = 0;
    _this.statusText = 'Unknown Error';
    _this.ok = false;
    _this.type = HttpEventType.ResponseError;
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
}(_wrapNativeSuper(Error));var HttpResponse = function () {
  function HttpResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = HttpEventType.Response;
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
}();var HttpFetchHandler = function () {
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
    var requestInit = request.toInitRequest();
    var stateKey = rxcomp.TransferService.makeKey(request.transferKey);
    var response;

    if (rxcomp.isPlatformBrowser && request.hydrate && rxcomp.TransferService.has(stateKey)) {
      var transfer = rxcomp.TransferService.get(stateKey);

      if (transfer) {
        response = new HttpResponse(transfer);
      }

      rxcomp.TransferService.remove(stateKey);
    }

    if (response) {
      return rxjs.of(response);
    } else {
      return rxjs.from(fetch(requestInfo, requestInit).then(function (response) {
        return _this.getProgress(response, request);
      }).then(function (response) {
        return _this.getResponse(response, request);
      })).pipe(operators.tap(function (response) {
        if (rxcomp.isPlatformServer && request.hydrate) {
          rxcomp.TransferService.set(stateKey, response.toObject());
        }
      }), operators.catchError(function (error) {
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

        var httpErrorResponse = new HttpErrorResponse(errorResponse);
        rxcomp.nextError$.next(httpErrorResponse);
        return rxjs.of(_this.response_);
      }), operators.finalize(function () {
        _this.response_ = null;
      }));
    }
  };

  _proto.getProgress = function getProgress(response, request) {
    var _this2 = this;

    var clonedBody = response.clone().body;

    if (rxcomp.isPlatformBrowser && request.reportProgress && clonedBody) {
      var reader = clonedBody.getReader();
      var contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
      return new Promise(function (resolve, reject) {
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
            }

            return reader.read().then(function (_ref) {
              var value = _ref.value,
                  done = _ref.done;
              return onProgress(value, done);
            });
          } else {
            progress.total = contentLength;
            progress.current = contentLength;
            progress.progress = 1;
            progress.percent = 100;
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
        var push = function push() {
          reader.read().then(function (_ref3) {
            var done = _ref3.done,
                value = _ref3.value;

            if (done) {
              controller.close();
              return;
            }

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
}();var HttpInterceptorHandler = function () {
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
var fetchHandler = new HttpFetchHandler();
var HttpInterceptingHandler = function () {
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
}();var factories = [];
var pipes = [];

var HttpModule = function (_Module) {
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
};var HttpUrlEncodingCodec = function () {
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
var HttpSerializerCodec = function () {
  function HttpSerializerCodec() {}

  var _proto2 = HttpSerializerCodec.prototype;

  _proto2.encodeKey = function encodeKey(key) {
    return encodeParam_(key);
  };

  _proto2.decodeKey = function decodeKey(key) {
    return decodeURIComponent(key);
  };

  _proto2.encodeValue = function encodeValue(value) {
    console.log('encodeValue', value);
    return rxcomp.Serializer.encode(value, [rxcomp.encodeJson, encodeURIComponent, rxcomp.encodeBase64]) || '';
  };

  _proto2.decodeValue = function decodeValue(value) {
    console.log('decodeValue', value);
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
}var HttpParams = function () {
  function HttpParams(options, encoder) {
    if (encoder === void 0) {
      encoder = new HttpUrlEncodingCodec();
    }

    this.params_ = new Map();
    console.log('HttpParams', encoder);
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
    }
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
      }).join('&') : '');
      console.log(key, values, keyValue, _this.encoder);
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
      }
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
}();var HttpRequest = function () {
  function HttpRequest(method, url, third, fourth) {
    this.url = url;
    this.reportProgress = false;
    this.withCredentials = false;
    this.hydrate = true;
    this.observe = 'body';
    this.responseType = 'json';
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
      });
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
}var HttpService = function () {
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
    }

    HttpService.incrementPendingRequest();
    var events$ = rxjs.of(request).pipe(operators.concatMap(function (request) {
      return _this.handler.handle(request);
    }), operators.finalize(function () {
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
HttpService.pendingRequests$ = new rxjs.BehaviorSubject(0);
HttpService.handler = new HttpInterceptingHandler();

function optionsWithBody_(options, body) {
  return Object.assign({}, options, {
    body: body
  });
}var AppComponent = function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.items = [];
    _this.error = null;
    return _this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('init');
    HttpService.get$("/rxcomp-http/data/get-todos.json", {
      params: {
        q: {
          a: 1,
          b: 2,
          c: [1, 2, 3, 4]
        }
      },
      paramsEncoder: new HttpSerializerCodec()
    }).pipe(operators.first()).subscribe(function (response) {
      _this2.items = response.data.getTodos;

      _this2.pushChanges();
    }, function (error) {
      return console.log;
    });
    rxcomp.errors$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (error) {
      _this2.error = error;

      _this2.pushChanges();
    });
  };

  _proto.onClick = function onClick(item) {
    item.completed = !item.completed;
    this.pushChanges();
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var CustomRequestInterceptor = function () {
  function CustomRequestInterceptor() {}

  var _proto = CustomRequestInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    return next.handle(request);
  };

  return CustomRequestInterceptor;
}();
var CustomResponseInterceptor = function () {
  function CustomResponseInterceptor() {}

  var _proto2 = CustomResponseInterceptor.prototype;

  _proto2.intercept = function intercept(request, next) {
    return next.handle(request).pipe(operators.tap(function (event) {
      if (event instanceof HttpResponse) {
        console.log('CustomResponseInterceptor.status', event.status);
        console.log('CustomResponseInterceptor.filter', request.params.get('filter'));
      }
    }));
  };

  return CustomResponseInterceptor;
}();var AppModule = function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, HttpModule.useInterceptors([CustomRequestInterceptor, CustomResponseInterceptor])],
  declarations: [],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxjs,rxjs.operators));