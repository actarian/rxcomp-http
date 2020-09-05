import { IModuleMeta, Module } from 'rxcomp';
import { IHttpInterceptorConstructor } from './http/http-interceptor';
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
    static meta: IModuleMeta;
    static useInterceptors(interceptorFactories?: IHttpInterceptorConstructor[]): typeof HttpModule;
}
