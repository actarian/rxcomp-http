import { Module } from 'rxcomp';
import { HttpInterceptors } from './http/http-interceptor';
const factories = [];
const pipes = [];
/**
 *  HttpModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    HttpModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */
export default class HttpModule extends Module {
    static useInterceptors(interceptorFactories) {
        if (interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.length) {
            const interceptors = interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.map(x => new x());
            HttpInterceptors.push.apply(HttpInterceptors, interceptors);
        }
        return this;
    }
}
HttpModule.meta = {
    declarations: [
        ...factories,
        ...pipes,
    ],
    exports: [
        ...factories,
        ...pipes,
    ]
};
