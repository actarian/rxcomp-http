import { HttpEventType } from './http-event';
import { HttpHeaders } from './http-headers';
import { HttpRequest } from './http-request';
import { IHttpHeaderResponse } from './http-response';
export interface IHttpJsonParseError {
    error: Error;
    text: string;
}
export interface IHttpErrorResponse<T> extends IHttpHeaderResponse<T> {
    error?: any | undefined;
    message?: string;
    name?: string;
    request?: HttpRequest<T> | null;
}
export declare class HttpErrorResponse<T> extends Error implements IHttpErrorResponse<T> {
    readonly headers: HttpHeaders;
    readonly status: number;
    readonly statusText: string;
    readonly url: string | undefined;
    readonly ok: boolean;
    readonly type: HttpEventType.ResponseError;
    readonly error: any | undefined;
    readonly message: string;
    readonly name: string;
    readonly request: HttpRequest<T> | null;
    constructor(options?: IHttpErrorResponse<T>);
    clone<T>(options?: IHttpErrorResponse<T>): HttpErrorResponse<T>;
}
