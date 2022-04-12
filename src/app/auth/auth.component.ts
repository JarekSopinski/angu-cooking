import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "./auth.service";

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
        private authService: AuthService
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

        this.isLoading = true;
        this.isLoginMode ? this.handleLogin() : this.handleSignup();

        form.reset();
    }

    handleLogin() {

    }

    handleSignup() {
        this.authService.signup(this.submittedEmail, this.submittedPassword).subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        )
    }

}