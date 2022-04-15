import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    // Intercepts all requests and adds Token

    constructor(
        private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.authService.user.pipe(
            take(1), // With rxjs operator take() we take only one value from that sub. and then automaticly unsubscribe.
            exhaustMap(user => {
                /**
                 * exhaustMap waits for the first observable to complete, which will happen after we took the latest user
                 * Then it gives us that user, then we get the data from the previous observable
                 * and now we return a new observable in there, which will then replace previous observable in the
                 * entire observable chain.
                 * So basicly we merge two observables.
                 */
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({ 
                    params: new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq);
            })
        );

    }

}