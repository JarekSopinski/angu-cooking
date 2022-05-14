import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";

import { User } from "./user.model";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimeout:any;

    apiKey:string = environment.firebaseAPIKey;
    apiEndpointSignup:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
    apiEndpointSignin:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

    constructor(
        private http:HttpClient,
        private router:Router,
        private store:Store<fromApp.AppState>
    ) {}

    logout() {
        // this.user.next(null);
        this.store.dispatch( new AuthActions.Logout() );
        localStorage.removeItem('userData');
        this.tokenExpirationTimeout && clearTimeout(this.tokenExpirationTimeout);
        this.tokenExpirationTimeout = null;
    }

    autoLogin() {
        const userData: {
            email:string,
            id:string,
            _token:string,
            _tokenExpirationDate:string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch( new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }) );
            const expirationDuration:number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

    }

    autoLogout(expirationDuration:number) {
        // Logout when token expires
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email:string, userId:string, token:string, expiresIn:number) {
        /**
         * Both in login and signup process, we use data returned from API to create a new User and pass it to our Subject.
         */
        const expirationDate:Date = new Date(
            new Date().getTime() + expiresIn * 1000 // calculate token's expiration time
        );
        const user = new User(
            email, 
            userId, 
            token, 
            expirationDate
        );
        // this.user.next(user);
        this.store.dispatch( new AuthActions.AuthenticateSuccess({
            email,
            userId,
            token,
            expirationDate
        }) );
        this.autoLogout(expiresIn * 1000); // convert miliseconds to seconds
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes:HttpErrorResponse) {

        let errorMessage:string = 'An unknown error occurred!';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = 'This email exists already!'; break;
            case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist!'; break;
            case 'INVALID_PASSWORD': errorMessage = 'This password is not correct!'; break;
        }
        return throwError(errorMessage);

    }

}