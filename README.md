# 💎 RxComp HttpModule

[![Licence](https://img.shields.io/github/license/actarian/rxcomp-http.svg)](https://github.com/actarian/rxcomp-http)

[RxComp Http](https://github.com/actarian/rxcomp-http) is the Http module for [RxComp](https://github.com/actarian/rxcomp), developed with [RxJs](https://github.com/ReactiveX/rxjs).

 lib & dependancy    | size
:--------------------|:----------------------------------------------------------------------------------------------|
rxcomp-http.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-http@1.0.0-beta.18/dist/umd/rxcomp-http.min.js.svg?compression=gzip)
rxcomp-http.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-http@1.0.0-beta.18/dist/umd/rxcomp-http.min.js.svg)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js.svg?compression=gzip)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js.svg)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg?compression=gzip)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg)
 
> [RxComp Http Demo](https://actarian.github.io/rxcomp-http/)  
> [RxComp Http Api](https://actarian.github.io/rxcomp-http/api/)  

![](https://rawcdn.githack.com/actarian/rxcomp-http/master/docs/img/rxcomp-http-demo.jpg?token=AAOBSISYZJXZNFFWAPGOLYC7DQKIO)  

___
## Installation and Usage

### ES6 via npm
This library depend on [RxComp](https://github.com/actarian/rxcomp) and [RxJs](https://github.com/ReactiveX/rxjs)  
install via npm or include via script   

```
npm install rxjs rxcomp rxcomp-http --save
```
___
### CDN

For CDN, you can use unpkg

```html
<script src="https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js" crossorigin="anonymous" SameSite="none Secure"></script>
<script src="https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
<script src="https://unpkg.com/rxcomp-http@1.0.0-beta.18/dist/umd/rxcomp-http.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
```

The global namespace for RxComp is `rxcomp`

```javascript
import { CoreModule, Module } from 'rxcomp';
```

The global namespace for RxComp HttpModule is `rxcomp.http`

```javascript
import { HttpModule } from 'rxcomp-http';
```
___
### Bootstrapping Module

```javascript
import { Browser, CoreModule, Module } from 'rxcomp';
import { HttpModule } from 'rxcomp-http';
import AppComponent from './app.component';

export default class AppModule extends Module {}

AppModule.meta = {
    imports: [
        CoreModule,
        HttpModule,
    ],
    declarations: [],
    bootstrap: AppComponent,
};

Browser.bootstrap(AppModule);
```
___
### HttpService
Import `HttpService` and call any CRUD method as `Observable`.

```javascript
import { HttpService } from 'rxcomp-http';

HttpService.get$<IResponseData>(methodUrl).pipe(
  first(),
).subscribe((response: IResponseData) => {
  this.items = response.data.getTodos;
  this.pushChanges();
}, error => console.log);
```
___
### Interceptors
You can create your custom interceptors implementing `IHttpInterceptors`.

```javascript
import { IHttpInterceptor } from 'rxcomp-http';

export class CustomRequestInterceptor implements IHttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (shouldCancelRequest) {
            return EMPTY;
        }
    		return next.handle(request);
    }
}

export class CustomResponseInterceptor implements IHttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log('CustomResponseInterceptor.status', event.status);
                    console.log('CustomResponseInterceptor.filter', request.params.get('filter'));
                }
            })
        );
    }
}
```

Add your custom interceptors in the AppModule.

```javascript

AppModule.meta = {
    imports: [
        CoreModule,
        HttpModule.useInterceptors([
          CustomRequestInterceptor, 
          CustomResponseInterceptor
        ]),
    ],
    declarations: [],
    bootstrap: AppComponent,
};

```
___
### Browser Compatibility
RxComp supports all browsers that are [ES5-compliant](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported).
___
## Contributing

*Pull requests are welcome and please submit bugs 🐞*
___
### Install packages
```
npm install
```
___
### Build, Serve & Watch 
```
gulp
```
___
### Build Dist
```
gulp build --target dist
```
___
*Thank you for taking the time to provide feedback and review. This feedback is appreciated and very helpful 🌈*

[![GitHub forks](https://img.shields.io/github/forks/actarian/rxcomp.svg?style=social&label=Fork&maxAge=2592000)](https://gitHub.com/actarian/rxcomp/network/)  [![GitHub stars](https://img.shields.io/github/stars/actarian/rxcomp.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/actarian/rxcomp/stargazers/)  [![GitHub followers](https://img.shields.io/github/followers/actarian.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/actarian?tab=followers)

* [Github Project Page](https://github.com/actarian/rxcomp)  

*If you find it helpful, feel free to contribute in keeping this library up to date via [PayPal](https://www.paypal.me/circledev/5)*

[![PayPal](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.me/circledev/5)  

___
## Contact

* Luca Zampetti <lzampetti@gmail.com>
* Follow [@actarian](https://twitter.com/actarian) on Twitter

[![Twitter Follow](https://img.shields.io/twitter/follow/actarian.svg?style=social&label=Follow%20@actarian)](https://twitter.com/actarian)  

___
## Release Notes
Changelog [here](https://github.com/actarian/rxcomp-http/blob/master/CHANGELOG.md).
