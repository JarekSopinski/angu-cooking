import { Injectable } from "@angular/core";
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

    private tokenExpirationTimeout:any;

    constructor(
        private store:Store<fromApp.AppState>
    ) {}

    autoLogout(expirationDuration:number) {
        // Logout when token expires
        this.tokenExpirationTimeout = setTimeout(() => {
            // this.logout();
        }, expirationDuration);
    }

}