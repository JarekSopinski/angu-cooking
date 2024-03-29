/**
 * Handle API calls and errors as side effects of dispatching Auth Actions.
 */

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
}

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
    ) => {
    const expirationDate:Date = new Date(
        new Date().getTime() + expiresIn * 1000
    );
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        shouldRedirectToHome: true
    });
};

const handleError = (errorRes: any) => {
    let errorMessage:string = 'An unknown error occurred!';
    if(!errorRes.error || !errorRes.error.error){
        // of() operator creates new observable
        return of( new AuthActions.AuthenticateFail(errorMessage) );
    }
    switch(errorRes.error.error.message) {
        case 'EMAIL_EXISTS': errorMessage = 'This email exists already!'; break;
        case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist!'; break;
        case 'INVALID_PASSWORD': errorMessage = 'This password is not correct!'; break;
    }

    return of( new AuthActions.AuthenticateFail(errorMessage) );
};

@Injectable()
export class AuthEffects {

    apiKey:string = environment.firebaseAPIKey;
    apiEndpointSignup:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
    apiEndpointSignin:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap(
            (signupAction: AuthActions.SignupStart) => {
                return this.http.post<AuthResponseData>(
                    `${this.apiEndpointSignup}?key=${this.apiKey}`,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(
                        resData => {
                            this.authService.setLogoutTimeout( +resData.expiresIn * 1000 );
                        }
                    ),
                    map(
                        resData => {
                            return handleAuthentication(
                                +resData.expiresIn, 
                                resData.email, 
                                resData.localId, 
                                resData.idToken
                            );
                        }
                    ),
                    catchError(
                        errorRes => {
                            return handleError(errorRes);
                        }
                    )
                )
            }
        )
    );

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
                    tap(
                        resData => {
                            this.authService.setLogoutTimeout( +resData.expiresIn * 1000 );
                        }
                    ),
                    map(
                        resData => {
                            return handleAuthentication(
                                +resData.expiresIn, 
                                resData.email, 
                                resData.localId, 
                                resData.idToken
                            );
                        }
                    ),
                    catchError(
                        errorRes => {
                            return handleError(errorRes);
                        }
                    )
                );
            }
        )
    );

    @Effect({ dispatch: false }) // this effect will not yield a dispatchable action at the end
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(
            (authSuccessAction: AuthActions.AuthenticateSuccess) => {
                authSuccessAction.payload.shouldRedirectToHome && this.router.navigate(['/']);
            }
        )
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(
            () => {
                // retrive data from local storage
                const userData: {
                    email:string,
                    id:string,
                    _token:string,
                    _tokenExpirationDate:string
                } = JSON.parse(localStorage.getItem('userData'));
        
                if (!userData) {
                    return { type: 'DUMMY' };
                }

                // create user with that data
                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );
        
                // check if token is still valid
                if (loadedUser.token) {
                    const expirationDuration:number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimeout(expirationDuration);
                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        shouldRedirectToHome: false
                    });
                }

                // if there is no token, return dummy action to prevent error
                return { type: 'DUMMY' };

            }
        )
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(
            () => {
                this.authService.clearLogoutTimeout();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            }
        )
    );

    constructor (
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}
}