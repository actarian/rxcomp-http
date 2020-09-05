import { Observable } from 'rxjs';
import { HttpHandler } from './http-handler';
import { HttpHeaders } from './http-headers';
import { HttpRequest } from './http-request';
import { HttpEvent } from './http-response';
export interface IPartialResponse {
    headers: HttpHeaders;
    status: number;
    statusText: string;
    url: string;
}
export declare class HttpXhrHandler implements HttpHandler {
    handle<T>(request: HttpRequest<any>): Observable<HttpEvent<T>>;
}
