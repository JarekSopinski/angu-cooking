import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';

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

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            this.error && this.showErrorAlert(this.error);
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
                new authActions.LoginStart({ 
                    email: this.submittedEmail, 
                    password: this.submittedPassword
                })
            )
        } else {
            this.store.dispatch(
                new authActions.SignupStart({
                    email: this.submittedEmail,
                    password: this.submittedPassword
                })
            )
        }

        form.reset();
    }

    onHandleError() {
        // used to handle alert box in ngIf-based approach
        // by resetting error, we remove condition for alert box, therefore alert box will be closed
        this.error = null;
    }

    private showErrorAlert(message:string) {
        // used to handle alert box in programmatic-component-creation approach
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory); // creates new component in that place

        componentRef.instance.message = message;
        this.closeAlertSub = componentRef.instance.close.subscribe(() => {
            this.closeAlertSub.unsubscribe();
            hostViewContainerRef.clear(); // removes component by clearing all content of its parent
        });
    }

    ngOnDestroy(): void {
        this.closeAlertSub && this.closeAlertSub.unsubscribe();
    }

}