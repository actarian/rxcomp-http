
export type IHttpHeaders = string | { [name: string]: string | string[] };

export class HttpHeaders implements Headers {
	private headers_: Map<string, string[]> = new Map<string, string[]>();

	constructor(options?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined) {
		const headers = this.headers_;
		if (options instanceof HttpHeaders) {
			options.headers_.forEach((value, key) => {
				headers.set(key, value);
			});
		} else if (typeof (options as Headers)?.forEach === 'function') {
			(options as Headers).forEach((value, key) => {
				headers.set(key, value.split(', '));
			});
		} else if (typeof options === 'object') {
			Object.keys(options).forEach(key => {
				let values: string | string[] = (options as any)[key];
				if (typeof values === 'string') {
					values = [values];
				}
				if (headers.has(key)) {
					values.forEach(value => this.append(key, value));
				} else {
					headers.set(key, values);
				}
			});
		} else if (typeof options === 'string') {
			options.split('\n').forEach(line => {
				const index = line.indexOf(':');
				if (index > 0) {
					const key = line.slice(0, index);;
					const value = line.slice(index + 1).trim();
					if (headers.has(key)) {
						this.append(key, value);
					} else {
						headers.set(key, [value]);
					}
				}
			});
		}
		if (!headers.has('Accept')) {
			headers.set('Accept', ['application/json', 'text/plain', '*/*']);
		}
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', ['application/json']);
		}
	}

	has(key: string): boolean {
		return this.headers_.has(key);
	}

	get(key: string): string | null {
		const values = this.headers_.get(key);
		return values ? values.join(', ') : null;
	}

	set(key: string, value: string): HttpHeaders {
		const clone = this.clone_();
		clone.headers_.set(key, value.split(', '));
		return clone;
	}

	append(key: string, value: string): HttpHeaders {
		const clone = this.clone_();
		const values: string[] = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
		values.push(value);
		clone.headers_.set(key, values);
		return clone;
	}

	delete(key: string): HttpHeaders {
		const clone = this.clone_();
		clone.headers_.delete(key);
		return clone;
	}

	forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
		this.headers_.forEach((v, k) => {
			callback(v.join(', '), k, this);
		});
	}

	serialize(): Headers | string[][] | Record<string, string> | undefined {
		const headers: string[][] = [];
		this.forEach((value, key) => {
			headers.push([key, value]);
		});
		return headers;
	}

	private clone_(): HttpHeaders {
		const clone = new HttpHeaders();
		this.headers_.forEach((value, key) => {
			clone.headers_.set(key, value);
		});
		return clone;
	}

}
