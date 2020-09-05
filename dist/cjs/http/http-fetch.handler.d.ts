import { Observable } from 'rxjs';
import { HttpHandler } from './http-handler';
import { HttpRequest } from './http-request';
import { HttpEvent, HttpResponse } from './http-response';
export declare class HttpFetchHandler implements HttpHandler {
    private response_;
    handle<T>(request: HttpRequest<any>): Observable<HttpEvent<T>>;
    getProgress<T>(response: Response, request: HttpRequest<any>): Promise<Response | HttpResponse<T>>;
    getResponse<T>(response: Response | HttpResponse<T>, request: HttpRequest<any>): Promise<HttpResponse<T>>;
    getResponseType<T>(response: Response, request: HttpRequest<any>): Promise<HttpResponse<T>>;
    getReadableStream<T>(response: Response, request: HttpRequest<any>): ReadableStream;
}
