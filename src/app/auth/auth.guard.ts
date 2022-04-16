import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    // Protect routes for logged-in users only.

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.authService.user.pipe( // can't be returned directly because returns object, not boolean
            map(user => {
                return !!user; // transformed to return boolean
            }),
            // older solution with tap
            tap(isAuth => {
                if(!isAuth) { this.router.navigate['/auth']; }
            })
        )
        
    }

}