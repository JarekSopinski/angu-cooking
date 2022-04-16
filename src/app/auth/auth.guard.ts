import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

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
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.authService.user.pipe( // can't be returned directly because returns object, not boolean
            take(1), // always take latest user value and then unsubscribe
            map(user => {
                const isAuth = !!user;
                if (isAuth) { return true; }
                return this.router.createUrlTree(['/auth']); // redirect to auth if not logged-in
            })
        )
        
    }

}