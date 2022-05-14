import { Action } from "@ngrx/store";

export const AUTO_LOGIN = '[Auth] AUTO LOGIN';
export const LOGIN_START = '[Auth] LOGIN START';
export const SIGNUP_START = '[Auth] SIGNUP START';
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN'; // fot both login and signup
export const AUTHENTICATE_FAIL = '[Auth] LOGIN_FAIL'; // for both login and signup
export const CLEAR_ERROR = '[Auth] CLEAR ERROR';
export const LOGOUT = '[Auth] LOGOUT';

export class AutoLogin implements Action {

    readonly type = AUTO_LOGIN;

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

export class SignupStart implements Action {

    readonly type = SIGNUP_START;

    constructor (
        public payload: {
            email: string,
            password: string
        }
    ) {}

}

export class AuthenticateSuccess implements Action {

    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date;
            shouldRedirectToHome: boolean;
        }
    ) {}

}

export class AuthenticateFail implements Action {

    readonly type = AUTHENTICATE_FAIL;

    constructor(
        public payload: string
    ) {}

}

export class ClearError implements Action {

    readonly type = CLEAR_ERROR;

}

export class Logout implements Action {

    readonly type = LOGOUT;

}

export type AuthActionsType = 
    | AutoLogin 
    | LoginStart 
    | SignupStart
    | AuthenticateSuccess 
    | AuthenticateFail
    | ClearError
    | Logout;