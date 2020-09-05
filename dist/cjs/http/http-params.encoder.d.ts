export interface IHttpParamEncoder {
    encodeKey(key: string): string;
    decodeKey(key: string): string;
    encodeValue(value: string): string;
    decodeValue(value: string): string;
}
export declare class HttpUrlEncodingCodec implements IHttpParamEncoder {
    encodeKey(key: string): string;
    decodeKey(key: string): string;
    encodeValue(value: string): string;
    decodeValue(value: string): string;
}
export declare class HttpSerializerCodec implements IHttpParamEncoder {
    encodeKey(key: string): string;
    decodeKey(key: string): string;
    encodeValue(value: any): string;
    decodeValue(value: string): any;
}
export declare function parseRawParams_(params: Map<string, string[]>, queryString: string, encoder: IHttpParamEncoder): Map<string, string[]>;
