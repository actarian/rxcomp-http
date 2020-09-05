export class HttpHeaders {
    constructor(options) {
        var _a;
        this.headers_ = new Map();
        const headers = this.headers_;
        if (options instanceof HttpHeaders) {
            options.headers_.forEach((value, key) => {
                headers.set(key, value);
            });
        }
        else if (typeof ((_a = options) === null || _a === void 0 ? void 0 : _a.forEach) === 'function') {
            options.forEach((value, key) => {
                headers.set(key, value.split(', '));
            });
        }
        else if (typeof options === 'object') {
            Object.keys(options).forEach(key => {
                let values = options[key];
                if (typeof values === 'string') {
                    values = [values];
                }
                if (headers.has(key)) {
                    values.forEach(value => this.append(key, value));
                }
                else {
                    headers.set(key, values);
                }
            });
        }
        else if (typeof options === 'string') {
            options.split('\n').forEach(line => {
                const index = line.indexOf(':');
                if (index > 0) {
                    const key = line.slice(0, index);
                    ;
                    const value = line.slice(index + 1).trim();
                    if (headers.has(key)) {
                        this.append(key, value);
                    }
                    else {
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
    has(key) {
        return this.headers_.has(key);
    }
    get(key) {
        const values = this.headers_.get(key);
        return values ? values.join(', ') : null;
    }
    set(key, value) {
        const clone = this.clone_();
        clone.headers_.set(key, value.split(', '));
        return clone;
    }
    append(key, value) {
        const clone = this.clone_();
        const values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
        values.push(value);
        clone.headers_.set(key, values);
        return clone;
    }
    delete(key) {
        const clone = this.clone_();
        clone.headers_.delete(key);
        return clone;
    }
    forEach(callback, thisArg) {
        this.headers_.forEach((v, k) => {
            callback(v.join(', '), k, this);
        });
    }
    serialize() {
        const headers = [];
        this.forEach((value, key) => {
            headers.push([key, value]);
        });
        return headers;
    }
    toObject() {
        const headers = {};
        this.forEach((value, key) => {
            headers[key] = value;
        });
        return headers;
    }
    clone_() {
        const clone = new HttpHeaders();
        this.headers_.forEach((value, key) => {
            clone.headers_.set(key, value);
        });
        return clone;
    }
}
