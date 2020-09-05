import { decodeBase64, decodeJson, encodeBase64, encodeJson, Serializer } from "rxcomp";
export class HttpUrlEncodingCodec {
    encodeKey(key) {
        return encodeParam_(key);
    }
    decodeKey(key) {
        return decodeURIComponent(key);
    }
    encodeValue(value) {
        return encodeParam_(value);
    }
    decodeValue(value) {
        return decodeURIComponent(value);
    }
}
export class HttpSerializerCodec {
    encodeKey(key) {
        return encodeParam_(key);
    }
    decodeKey(key) {
        return decodeURIComponent(key);
    }
    encodeValue(value) {
        // console.log('encodeValue', value);
        return Serializer.encode(value, [encodeJson, encodeURIComponent, encodeBase64]) || '';
    }
    decodeValue(value) {
        // console.log('decodeValue', value);
        return Serializer.decode(value, [decodeBase64, decodeURIComponent, decodeJson]) || '';
    }
}
export function parseRawParams_(params, queryString, encoder) {
    if (queryString.length > 0) {
        const keyValueParams = queryString.split('&');
        keyValueParams.forEach((keyValue) => {
            const index = keyValue.indexOf('=');
            const [key, value] = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))];
            const values = params.get(key) || [];
            values.push(value);
            params.set(key, values);
        });
    }
    return params;
}
function encodeParam_(value) {
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
