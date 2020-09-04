import { Factory, IModuleMeta, Module, Pipe } from 'rxcomp';
import { HttpInterceptors, IHttpInterceptor, IHttpInterceptorConstructor } from './http/http-interceptor';

const factories: typeof Factory[] = [
];
const pipes: typeof Pipe[] = [
];
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
	static meta: IModuleMeta = {
		declarations: [
			...factories,
			...pipes,
		],
		exports: [
			...factories,
			...pipes,
		]
	};
	static useInterceptors(interceptorFactories?: IHttpInterceptorConstructor[]): typeof HttpModule {
		if (interceptorFactories?.length) {
			const interceptors: IHttpInterceptor[] = interceptorFactories?.map(x => new x());
			HttpInterceptors.push.apply(HttpInterceptors, interceptors);
		}
		return this;
	}
}
