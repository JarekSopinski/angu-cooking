import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService, AuthResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    isLoginMode:boolean = true;
    isLoading:boolean = false;
    error:string;
    submittedEmail:string;
    submittedPassword:string;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form:NgForm) {
        if (!form.valid) {
            return;
        }

        this.submittedEmail = form.value.email;
        this.submittedPassword = form.value.password;

        let authObservable:Observable<AuthResponseData>;

        this.isLoading = true;
        authObservable = ( 
            this.isLoginMode ? 
            this.authService.login(this.submittedEmail, this.submittedPassword) 
            : 
            this.authService.signup(this.submittedEmail, this.submittedPassword)
        );

        authObservable.subscribe(
            // Instead of running two subscriptions, we create this local sub. for auth http post requests.
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        )

        form.reset();
    }

    onHandleError() {
        this.error = null; // by resetting error, we remove condition for alert box, therefore alert box will be closed
    }

}