import { HttpFetchHandler } from './http-fetch.handler';
import { HttpXhrHandler } from './http-xhr.handler';
export class HttpInterceptorHandler {
    constructor(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
    }
    handle(req) {
        return this.interceptor.intercept(req, this.next);
    }
}
export const HttpInterceptors = [];
export class NoopInterceptor {
    intercept(req, next) {
        return next.handle(req);
    }
}
export const fetchHandler = new HttpFetchHandler();
export const xhrHandler = new HttpXhrHandler();
export class HttpInterceptingHandler {
    constructor() {
        this.chain = null;
    }
    handle(req) {
        if (this.chain === null) {
            const interceptors = HttpInterceptors;
            this.chain = interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), fetchHandler);
        }
        return this.chain.handle(req);
    }
}
export function interceptingHandler(handler, interceptors = []) {
    if (!interceptors) {
        return handler;
    }
    return interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), handler);
}
export function jsonpCallbackContext() {
    if (typeof window === 'object') {
        return window;
    }
    return {};
}
