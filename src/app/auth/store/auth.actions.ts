import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] LOGIN START';
export const SIGNUP_START = '[Auth] SIGNUP START';
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN'; // fot both login and signup
export const AUTHENTICATE_FAIL = '[Auth] LOGIN_FAIL'; // for both login and signup
export const LOGOUT = '[Auth] LOGOUT';

export class AuthenticateSuccess implements Action {

    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date;
        }
    ) {}

}

export class Logout implements Action {

    readonly type = LOGOUT;

}

export class LoginStart implements Action {
    
    readonly type = LOGIN_START;

    constructor (
        public payload: {
            email: string,
            password: string
        }
    ) {}

}

export class AuthenticateFail implements Action {

    readonly type = AUTHENTICATE_FAIL;

    constructor(
        public payload: string
    ) {}

}

export class SignupStart implements Action {

    readonly type = SIGNUP_START;

    constructor (
        public payload: {
            email: string,
            password: string
        }
    ) {}

}

export type AuthActionsType = 
    | AuthenticateSuccess 
    | Logout 
    | LoginStart 
    | AuthenticateFail;