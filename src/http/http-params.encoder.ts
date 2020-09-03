import { decodeBase64, decodeJson, encodeBase64, encodeJson, Serializer } from "rxcomp";

export interface IHttpParamEncoder {
	encodeKey(key: string): string;
	decodeKey(key: string): string;
	encodeValue(value: string): string;
	decodeValue(value: string): string;
}
export class HttpUrlEncodingCodec implements IHttpParamEncoder {
	encodeKey(key: string): string {
		return encodeParam_(key);
	}
	decodeKey(key: string): string {
		return decodeURIComponent(key);
	}
	encodeValue(value: string): string {
		return encodeParam_(value);
	}
	decodeValue(value: string): string {
		return decodeURIComponent(value);
	}
}
export class HttpSerializerCodec implements IHttpParamEncoder {
	encodeKey(key: string): string {
		return encodeParam_(key);
	}
	decodeKey(key: string): string {
		return decodeURIComponent(key);
	}
	encodeValue(value: any): string {
		// console.log('encodeValue', value);
		return Serializer.encode(value, [encodeJson, encodeURIComponent, encodeBase64]) || '';
	}
	decodeValue(value: string): any {
		// console.log('decodeValue', value);
		return Serializer.decode(value, [decodeBase64, decodeURIComponent, decodeJson]) || '';
	}
}
export function parseRawParams_(params: Map<string, string[]>, queryString: string, encoder: IHttpParamEncoder): Map<string, string[]> {
	if (queryString.length > 0) {
		const keyValueParams: string[] = queryString.split('&');
		keyValueParams.forEach((keyValue: string) => {
			const index = keyValue.indexOf('=');
			const [key, value]: string[] = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))];
			const values = params.get(key) || [];
			values.push(value);
			params.set(key, values);
		});
	}
	return params;
}
function encodeParam_(value: string): string {
	return encodeURIComponent(value)
		.replace(/%40/gi, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/gi, '$')
		.replace(/%2C/gi, ',')
		.replace(/%3B/gi, ';')
		.replace(/%2B/gi, '+')
		.replace(/%3D/gi, '=')
		.replace(/%3F/gi, '?')
		.replace(/%2F/gi, '/');
}
