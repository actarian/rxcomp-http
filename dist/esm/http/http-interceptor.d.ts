import { Observable } from 'rxjs';
import { HttpHandler } from './http-handler';
import { HttpRequest } from './http-request';
import { HttpEvent } from './http-response';
export interface IHttpInterceptorConstructor {
    new (): IHttpInterceptor;
}
export interface IHttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
export declare class HttpInterceptorHandler implements HttpHandler {
    private next;
    private interceptor;
    constructor(next: HttpHandler, interceptor: IHttpInterceptor);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
export declare const HttpInterceptors: IHttpInterceptor[];
export declare class NoopInterceptor implements IHttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
export declare const fetchHandler: HttpHandler;
export declare const xhrHandler: HttpHandler;
export declare class HttpInterceptingHandler implements HttpHandler {
    private chain;
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
export declare function interceptingHandler(handler: HttpHandler, interceptors?: IHttpInterceptor[] | null): HttpHandler;
export declare function jsonpCallbackContext(): Object;
