
import { EMPTY, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '../../../../src/rxcomp-http';

const cancelRequest: boolean = false;

export class CustomInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (cancelRequest) {
            return EMPTY;
        }
        const clonedRequest = request.clone({
            url: request.url,
        });
        // console.log('CustomInterceptor.clonedRequest', clonedRequest);
        return next.handle(clonedRequest);
        return next.handle(request).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log('CustomInterceptor.status', event.status);
                    console.log('CustomInterceptor.filter', request.params.get('filter'));
                }
            })
        );
    }
}
