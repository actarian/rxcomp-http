import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse, IHttpErrorResponse } from './http-error-response';
import { HttpHeaders } from './http-headers';
import { HttpInterceptingHandler } from './http-interceptor';
import { HttpParams } from './http-params';
import { HttpBodyType, HttpMethodType, HttpRequest, IHttpRequestInit } from './http-request';
import { HttpEvent, HttpResponse } from './http-response';

export default class HttpService {

	static pendingRequests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	static incrementPendingRequest() {
		HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
	}

	static decrementPendingRequest() {
		HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
	}

	// static handler: HttpHandler = new HttpFetchHandler();
	static handler: HttpInterceptingHandler = new HttpInterceptingHandler();

	static request$<T>(first: HttpMethodType | HttpRequest<T>, url?: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		let request: HttpRequest<T>;
		if (first instanceof HttpRequest) {
			request = first;
		} else {
			let headers: HttpHeaders | undefined = undefined;
			if (options.headers instanceof HttpHeaders) {
				headers = options.headers;
			} else {
				headers = new HttpHeaders(options.headers);
			}
			let params: HttpParams | undefined = undefined;
			if (options.params) {
				params = new HttpParams(options.params);
			}
			request = new HttpRequest(first, url!, (options.body !== undefined ? options.body : null), {
				headers,
				params,
				reportProgress: options.reportProgress,
				responseType: options.responseType || 'json',
				withCredentials: options.withCredentials,
			});
		}
		// console.log('HttpService.request$', request);
		HttpService.incrementPendingRequest();
		const events$: Observable<HttpEvent<any>> = of(request).pipe(
			concatMap((request: HttpRequest<T>) => this.handler.handle(request)),
			// tap((response: HttpEvent<any>) => console.log('HttpService.response', response)),
			finalize(() => HttpService.decrementPendingRequest())
		);
		if (first instanceof HttpRequest || options.observe === 'events') {
			return events$.pipe(
				catchError(error => {
					console.log('error', error);
					return throwError(this.getError(error, null, request));
				}),
			);
		}
		const response$: Observable<HttpResponse<T>> = <Observable<HttpResponse<T>>>events$.pipe(
			filter((event: HttpEvent<any>) => event instanceof HttpResponse),
		);
		let response_: HttpResponse<T>;
		const observe$: Observable<HttpResponse<T> | HttpBodyType<T>> = response$.pipe(
			map((response: HttpResponse<T>) => {
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
			}),
			catchError(error => {
				console.log('error', error);
				return throwError(this.getError(error, response_, request));
			}),
		)
		return observe$;
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
	}

	static delete$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static delete$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('DELETE', url, options);
	}

	static get$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static get$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('GET', url, options);
	}

	static head$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static head$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('HEAD', url, options);
	}

	static jsonp$<T>(url: string, callbackParam: string): Observable<T>;
	static jsonp$<T>(url: string, callbackParam: string): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('JSONP', url, {
			params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
			observe: 'body',
			responseType: 'json',
		});
	}

	static options$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static options$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('OPTIONS', url, options);
	}

	static patch$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static patch$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('PATCH', url, optionsWithBody_<T>(options, body));
	}

	static post$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static post$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('POST', url, optionsWithBody_<T>(options, body));
	}

	static put$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static put$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('PUT', url, optionsWithBody_<T>(options, body));
	}

	static getError<T>(error: any, response: HttpResponse<T> | null, request: HttpRequest<T> | null): HttpErrorResponse<T> {
		if (!error.status) {
			error.statusCode = response?.status || 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response?.statusText || 'Unknown Error';
		}
		const options: IHttpErrorResponse<T> = {
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
		return new HttpErrorResponse<T>(options);
	}

}

function optionsWithBody_<T>(options: IHttpRequestInit<T>, body: T | null): IHttpRequestInit<T> {
	return Object.assign({}, options, { body });
}