import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse } from './http-error-response';
import { HttpHeaders } from './http-headers';
import { HttpInterceptingHandler } from './http-interceptor';
import { HttpParams } from './http-params';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
export default class HttpService {
    static incrementPendingRequest() {
        HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
    }
    static decrementPendingRequest() {
        HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
    }
    static request$(first, url, options = {}) {
        let request;
        if (first instanceof HttpRequest) {
            request = first;
        }
        else {
            let headers = undefined;
            if (options.headers instanceof HttpHeaders) {
                headers = options.headers;
            }
            else {
                headers = new HttpHeaders(options.headers);
            }
            let params = undefined;
            if (options.params) {
                params = new HttpParams(options.params, options.paramsEncoder);
            }
            request = new HttpRequest(first, url, (options.body !== undefined ? options.body : null), {
                headers,
                params,
                reportProgress: options.reportProgress,
                responseType: options.responseType || 'json',
                withCredentials: options.withCredentials,
            });
        }
        // console.log('HttpService.request$', request);
        HttpService.incrementPendingRequest();
        const events$ = of(request).pipe(concatMap((request) => this.handler.handle(request)), 
        // tap((response: HttpEvent<any>) => {
        // console.log('HttpService.response', response)
        // ),
        finalize(() => HttpService.decrementPendingRequest()));
        if (first instanceof HttpRequest || options.observe === 'events') {
            return events$.pipe(catchError(error => {
                console.log('error', error);
                return throwError(this.getError(error, null, request));
            }));
        }
        const response$ = events$.pipe(filter((event) => event instanceof HttpResponse));
        let response_;
        const observe$ = response$.pipe(map((response) => {
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
                    throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
            }
        }), catchError(error => {
            console.log('error', error);
            return throwError(this.getError(error, response_, request));
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
    }
    static delete$(url, options = {}) {
        return this.request$('DELETE', url, options);
    }
    static get$(url, options = {}) {
        return this.request$('GET', url, options);
    }
    static head$(url, options = {}) {
        return this.request$('HEAD', url, options);
    }
    static jsonp$(url, callbackParam) {
        return this.request$('JSONP', url, {
            params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
            observe: 'body',
            responseType: 'json',
        });
    }
    static options$(url, options = {}) {
        return this.request$('OPTIONS', url, options);
    }
    static patch$(url, body, options = {}) {
        return this.request$('PATCH', url, optionsWithBody_(options, body));
    }
    static post$(url, body, options = {}) {
        return this.request$('POST', url, optionsWithBody_(options, body));
    }
    static put$(url, body, options = {}) {
        return this.request$('PUT', url, optionsWithBody_(options, body));
    }
    static getError(error, response, request) {
        if (!error.status) {
            error.statusCode = (response === null || response === void 0 ? void 0 : response.status) || 0;
        }
        if (!error.statusMessage) {
            error.statusMessage = (response === null || response === void 0 ? void 0 : response.statusText) || 'Unknown Error';
        }
        const options = {
            error,
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            request,
        };
        if (response) {
            options.headers = response.headers;
            options.status = options.status || response.status;
            options.statusText = options.statusText || response.statusText;
            options.url = response.url;
        }
        return new HttpErrorResponse(options);
    }
}
HttpService.pendingRequests$ = new BehaviorSubject(0);
// static handler: HttpHandler = new HttpFetchHandler();
HttpService.handler = new HttpInterceptingHandler();
function optionsWithBody_(options, body) {
    return Object.assign({}, options, { body });
}
