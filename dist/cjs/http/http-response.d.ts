import { HttpEventType, HttpProgressEvent, HttpSentEvent, HttpUserEvent } from './http-event';
import { HttpHeaders } from './http-headers';
import { HttpBodyType } from './http-request';
export declare type HttpEvent<T> = HttpSentEvent | HttpHeaderResponse<T> | HttpResponse<T> | HttpProgressEvent | HttpUserEvent<T>;
export interface IHttpHeaderResponse<T> {
    headers?: HttpHeaders;
    status?: number;
    statusText?: string;
    url?: string;
    ok?: boolean;
    type?: HttpEventType;
}
export interface IHttpResponse<T> extends IHttpHeaderResponse<T> {
    body?: HttpBodyType<T>;
}
export declare class HttpHeaderResponse<T> implements IHttpHeaderResponse<T> {
    readonly headers: HttpHeaders;
    readonly status: number;
    readonly statusText: string;
    readonly url: string | undefined;
    readonly ok: boolean;
    readonly type: HttpEventType.ResponseHeader;
    constructor(options?: IHttpHeaderResponse<T>);
    clone<T>(options?: IHttpHeaderResponse<T>): HttpHeaderResponse<T>;
}
export declare class HttpResponse<T> implements IHttpResponse<T> {
    readonly headers: HttpHeaders;
    readonly status: number;
    readonly statusText: string;
    readonly url: string | undefined;
    readonly ok: boolean;
    readonly type: HttpEventType.Response;
    readonly body: HttpBodyType<T>;
    constructor(options?: IHttpResponse<T>);
    clone<T>(options?: IHttpResponse<T>): HttpResponse<T>;
    toObject(): {
        [key: string]: any;
    };
}
export declare abstract class HttpResponseBase<T> {
    readonly headers: HttpHeaders;
    readonly status: number;
    readonly statusText: string;
    readonly url: string | undefined;
    readonly ok: boolean;
    readonly type: HttpEventType.Response | HttpEventType.ResponseHeader;
    constructor(options: IHttpHeaderResponse<T>, defaultStatus?: number, defaultStatusText?: string);
}
