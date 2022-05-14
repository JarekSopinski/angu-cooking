import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated:boolean = false;
    private userSub: Subscription;

    collapsed:boolean = true;

    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService,
        private store: Store<fromApp.AppState>
    ){}

    ngOnInit(): void {
        this.userSub = this.store.select('auth')
        .pipe(
            map(authState => authState.user) // return only user object, not whole auth state
        )
        .subscribe(user => {
            this.isAuthenticated = !user ? false : true;
        });
    }

    toggleNavbarCollapsed() {
        this.collapsed = !this.collapsed;
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

    onFetchData(){
        this.store.dispatch( new RecipeActions.FetchRecipes() );
    }

    onLogout(){
        this.store.dispatch( new AuthActions.Logout() );
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

}