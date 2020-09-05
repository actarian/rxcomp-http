import { HttpUrlEncodingCodec, parseRawParams_ } from "./http-params.encoder";
export class HttpParams {
    constructor(options, encoder = new HttpUrlEncodingCodec()) {
        this.params_ = new Map();
        // console.log('HttpParams', encoder);
        this.encoder = encoder;
        const params = this.params_;
        if (options instanceof HttpParams) {
            options.params_.forEach((value, key) => {
                params.set(key, value);
            });
        }
        else if (typeof options === 'object') {
            Object.keys(options).forEach(key => {
                const value = options[key];
                params.set(key, Array.isArray(value) ? value : [value]);
            });
        }
        else if (typeof options === 'string') {
            parseRawParams_(params, options, this.encoder);
        }
        // ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D
    }
    keys() {
        return Array.from(this.params_.keys());
    }
    has(key) {
        return this.params_.has(key);
    }
    get(key) {
        const value = this.params_.get(key);
        return value ? value[0] : null;
    }
    getAll(key) {
        return this.params_.get(key) || null;
    }
    set(key, value) {
        const clone = this.clone_();
        clone.params_.set(key, [value]);
        return clone;
    }
    append(key, value) {
        const clone = this.clone_();
        if (clone.has(key)) {
            const values = clone.params_.get(key) || [];
            values.push(value);
            clone.params_.set(key, values);
        }
        else {
            clone.params_.set(key, [value]);
        }
        return clone;
    }
    delete(key) {
        const clone = this.clone_();
        clone.params_.delete(key);
        return clone;
    }
    toString() {
        return this.keys().map((key) => {
            const values = this.params_.get(key);
            const keyValue = this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');
            // console.log(key, values, keyValue, this.encoder);
            return keyValue;
        }).filter(keyValue => keyValue !== '').join('&');
    }
    toObject() {
        let params = {};
        this.keys().map((key) => {
            const values = this.params_.get(key);
            if (values) {
                params[key] = values;
            }
            // return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');
        });
        return params;
    }
    clone_() {
        const clone = new HttpParams(undefined, this.encoder);
        this.params_.forEach((value, key) => {
            clone.params_.set(key, value);
        });
        return clone;
    }
}
