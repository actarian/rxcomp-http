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
export class HttpErrorResponse<T> extends Error implements IHttpErrorResponse<T> {
	readonly headers!: HttpHeaders;
	readonly status: number = 0;
	readonly statusText: string = 'Unknown Error';
	readonly url: string | undefined;
	readonly ok: boolean = false;
	readonly type: HttpEventType.ResponseError = HttpEventType.ResponseError;
	readonly error: any | undefined;
	readonly message: string = 'Unknown Error';
	readonly name: string = 'HttpErrorResponse';
	readonly request!: HttpRequest<T> | null;
	constructor(options?: IHttpErrorResponse<T>) {
		super(options?.message || 'Unknown Error');
		if (options) {
			this.headers = new HttpHeaders(options.headers);
			this.status = options.status || this.status;
			this.statusText = options.statusText || this.statusText;
			this.url = options.url || this.url;
			this.error = options.error || this.error;
			this.name = options.name || this.name;
			this.request = options.request || null;
		}
	}
	clone<T>(options?: IHttpErrorResponse<T>): HttpErrorResponse<T> {
		options = Object.assign({
			headers: this.headers,
			status: this.status,
			statusText: this.statusText,
			url: this.url,
			error: this.error,
			message: this.message,
			name: this.name,
			request: this.request,
		}, options || {});
		const clone = new HttpErrorResponse<T>(options);
		return clone;
	}
}
