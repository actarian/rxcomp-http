"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var http_interceptor_1 = require("./http/http-interceptor");
var factories = [];
var pipes = [];
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
var HttpModule = /** @class */ (function (_super) {
    tslib_1.__extends(HttpModule, _super);
    function HttpModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HttpModule.useInterceptors = function (interceptorFactories) {
        if (interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.length) {
            var interceptors = interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.map(function (x) { return new x(); });
            http_interceptor_1.HttpInterceptors.push.apply(http_interceptor_1.HttpInterceptors, interceptors);
        }
        return this;
    };
    HttpModule.meta = {
        declarations: tslib_1.__spread(factories, pipes),
        exports: tslib_1.__spread(factories, pipes)
    };
    return HttpModule;
}(rxcomp_1.Module));
exports.default = HttpModule;
