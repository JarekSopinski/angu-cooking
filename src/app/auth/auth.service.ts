import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

interface AuthResponseData {
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    apiKey:string = 'AIzaSyCk39ojjZvuNfanOqtmFEMSIVJaZn-kkJ0';
    apiEndpointSignup:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';

    constructor(
        private http:HttpClient
    ) {}

    signup(
        email:string,
        password:string
    ) {

        return this.http.post<AuthResponseData>(
            `${this.apiEndpointSignup}?key=${this.apiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(errorRes => {
                let errorMessage:string = 'An unknown error occurred!';
                if(!errorRes.error || !errorRes.error.error){
                    return throwError(errorMessage);
                }
                switch(errorRes.error.error.message) {
                    case 'EMAIL_EXISTS': errorMessage = 'This email exists already!'; break;
                }
                return throwError(errorMessage);
            })
        );

    }

}