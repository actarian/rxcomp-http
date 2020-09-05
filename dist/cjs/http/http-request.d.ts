import { HttpHeaders } from './http-headers';
import { HttpParams } from './http-params';
import { IHttpParamEncoder } from './http-params.encoder';
export declare type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'JSONP';
export declare type HttpMethodBodyType = 'POST' | 'PUT' | 'PATCH';
export declare type HttpMethodNoBodyType = 'GET' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'JSONP';
export declare type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';
export declare type HttpBodyType<T> = T | string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
export declare type HttpObserveType = 'body' | 'events' | 'response';
export interface IHttpRequestInit<T> {
    headers?: HttpHeaders | Headers | {
        [key: string]: string | string[];
    } | string | undefined;
    reportProgress?: boolean;
    params?: HttpParams | {
        [key: string]: any;
    } | string | undefined;
    paramsEncoder?: IHttpParamEncoder;
    responseType?: HttpResponseType;
    withCredentials?: boolean;
    hydrate?: boolean;
    observe?: HttpObserveType;
    body?: HttpBodyType<T>;
}
export interface IHttpRequest<T> extends IHttpRequestInit<T> {
    method?: HttpMethodType;
    url?: string;
}
export declare class HttpRequest<T> {
    readonly url: string;
    readonly body: HttpBodyType<T>;
    readonly headers: HttpHeaders;
    readonly reportProgress: boolean;
    readonly withCredentials: boolean;
    readonly hydrate: boolean;
    readonly observe: HttpObserveType;
    readonly responseType: HttpResponseType;
    readonly method: HttpMethodType;
    readonly params: HttpParams;
    readonly urlWithParams: string;
    get transferKey(): string;
    constructor(method: HttpMethodNoBodyType, url: string, options?: IHttpRequestInit<T>);
    constructor(method: HttpMethodBodyType, url: string, body: HttpBodyType<T>, options?: IHttpRequestInit<T>);
    constructor(method: HttpMethodType, url: string, body: HttpBodyType<T>, options?: IHttpRequestInit<T>);
    serializeBody(): ArrayBuffer | Blob | FormData | string | null;
    detectContentTypeHeader(): string | null;
    toInitRequest(): RequestInit;
    toFetchRequest__(): Request;
    clone<T>(options?: IHttpRequest<T>): HttpRequest<T>;
    toObject(): {
        [key: string]: any;
    };
}
