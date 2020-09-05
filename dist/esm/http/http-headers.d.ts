export declare type IHttpHeaders = string | {
    [name: string]: string | string[];
};
export declare class HttpHeaders implements Headers {
    private headers_;
    constructor(options?: HttpHeaders | Headers | {
        [key: string]: string | string[];
    } | string | undefined);
    has(key: string): boolean;
    get(key: string): string | null;
    set(key: string, value: string): HttpHeaders;
    append(key: string, value: string): HttpHeaders;
    delete(key: string): HttpHeaders;
    forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
    serialize(): Headers | string[][] | Record<string, string> | undefined;
    toObject(): {
        [key: string]: string;
    };
    private clone_;
}
