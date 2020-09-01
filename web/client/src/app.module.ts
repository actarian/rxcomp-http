import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { HttpModule } from '../../../src/rxcomp-http';
import AppComponent from './app.component';
import { CustomRequestInterceptor, CustomResponseInterceptor } from './http/custom.interceptor';

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			HttpModule.useInterceptors([
				CustomRequestInterceptor,
				CustomResponseInterceptor,
			]),
		],
		declarations: [
		],
		bootstrap: AppComponent,
	};

}
