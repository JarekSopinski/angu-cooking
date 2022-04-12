import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface AuthResponseData {
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

        let signupParams = new HttpParams();
        signupParams.append('key', this.apiKey);

        return this.http.post<AuthResponseData>(
            this.apiEndpointSignup,
            {
                email: email,
                password: password,
                returnSecureToken: true
            },
            {
                params: signupParams
            }
        )

    }

}