import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { HttpInterceptors, HttpModule } from '../../../src/rxcomp-http';
import AppComponent from './app.component';
import { CustomInterceptor } from './http/custom.interceptor';

HttpInterceptors.push(new CustomInterceptor());

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			HttpModule,
		],
		declarations: [
		],
		bootstrap: AppComponent,
	};

}
