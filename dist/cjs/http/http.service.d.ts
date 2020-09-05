import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from './http-error-response';
import { HttpInterceptingHandler } from './http-interceptor';
import { HttpBodyType, HttpMethodType, HttpRequest, IHttpRequestInit } from './http-request';
import { HttpEvent, HttpResponse } from './http-response';
export default class HttpService {
    static pendingRequests$: BehaviorSubject<number>;
    static incrementPendingRequest(): void;
    static decrementPendingRequest(): void;
    static handler: HttpInterceptingHandler;
    static request$<T>(first: HttpMethodType | HttpRequest<T>, url?: string, options?: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static delete$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
    static delete$<T>(url: string, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static get$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
    static get$<T>(url: string, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static head$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
    static head$<T>(url: string, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static jsonp$<T>(url: string, callbackParam: string): Observable<T>;
    static jsonp$<T>(url: string, callbackParam: string): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static options$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
    static options$<T>(url: string, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static patch$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
    static patch$<T>(url: string, body: any | null, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static post$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
    static post$<T>(url: string, body: any | null, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static put$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
    static put$<T>(url: string, body: any | null, options: IHttpRequestInit<T>): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>>;
    static getError<T>(error: any, response: HttpResponse<T> | null, request: HttpRequest<T> | null): HttpErrorResponse<T>;
}
