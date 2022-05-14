import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

    isLoginMode:boolean = true;
    isLoading:boolean = false;
    error:string;
    submittedEmail:string;
    submittedPassword:string;
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    private closeAlertSub:Subscription;
    private storeSub:Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form:NgForm) {
        if (!form.valid) {
            return;
        }

        this.submittedEmail = form.value.email;
        this.submittedPassword = form.value.password;

        if (this.isLoginMode){
            this.store.dispatch(
                new AuthActions.LoginStart({ 
                    email: this.submittedEmail, 
                    password: this.submittedPassword
                })
            )
        } else {
            this.store.dispatch(
                new AuthActions.SignupStart({
                    email: this.submittedEmail,
                    password: this.submittedPassword
                })
            )
        }

        form.reset();
    }

    onHandleError() {
        this.store.dispatch( new AuthActions.ClearError() );
    }

    ngOnDestroy(): void {
        this.closeAlertSub && this.closeAlertSub.unsubscribe();
        this.storeSub && this.storeSub.unsubscribe();
    }

}