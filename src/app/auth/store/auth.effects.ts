/**
 * Execute some code (in this case API connection) as a side effect, when an action is dispatched.
 */

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
}

@Injectable()
export class AuthEffects {

    apiKey:string = environment.firebaseAPIKey;
    apiEndpointSignup:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
    apiEndpointSignin:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap(
            (authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponseData>(
                    `${this.apiEndpointSignin}?key=${this.apiKey}`,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe( // add another observable on inner observable to handle errors
                    map(
                        resData => {
                            const expirationDate:Date = new Date(
                                new Date().getTime() + +resData.expiresIn * 1000
                            );
                            return new AuthActions.Login({
                                email: resData.email,
                                userId: resData.localId,
                                token: resData.idToken,
                                expirationDate: expirationDate
                            });
                        }
                    ),
                    catchError(
                        errorRes => {

                            let errorMessage:string = 'An unknown error occurred!';
                            if(!errorRes.error || !errorRes.error.error){
                                // of() operator creates new observable
                                return of( new AuthActions.LoginFail(errorMessage) );
                            }
                            switch(errorRes.error.error.message) {
                                case 'EMAIL_EXISTS': errorMessage = 'This email exists already!'; break;
                                case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist!'; break;
                                case 'INVALID_PASSWORD': errorMessage = 'This password is not correct!'; break;
                            }

                            return of( new AuthActions.LoginFail(errorMessage) );

                        } // error func. end
                    )
                );
            }
        )
    );

    @Effect({ dispatch: false }) // this effect will not yield a dispatchable action at the end
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(
            () => {
                this.router.navigate(['/']);
            }
        )
    )

    constructor (
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) {}
}