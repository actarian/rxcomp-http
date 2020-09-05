import { IHttpParamEncoder } from "./http-params.encoder";
export declare class HttpParams {
    private params_;
    private encoder;
    constructor(options?: HttpParams | {
        [key: string]: any;
    } | string | undefined, encoder?: IHttpParamEncoder);
    keys(): string[];
    has(key: string): boolean;
    get(key: string): string | null;
    getAll(key: string): string[] | null;
    set(key: string, value: string): HttpParams;
    append(key: string, value: string): HttpParams;
    delete(key: string): HttpParams;
    toString(): string;
    toObject(): {
        [keys: string]: any;
    };
    private clone_;
}
