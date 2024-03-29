import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { exhaustMap, take, map } from "rxjs/operators";

import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    // Intercepts all requests (except login and signup) and adds Token

    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.store.select('auth').pipe(
            take(1), // With rxjs operator take() we take only one value from that sub. and then automaticly unsubscribe.
            map(authState => {
                return authState.user; // get only user object, not whole auth state
            }),
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