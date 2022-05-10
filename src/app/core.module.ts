/**
 * Core module can be used to keep all services and interceptors, as an alternative to providing them in app module.
 * There is no point in using this approach when using Injectable.
 */
import { NgModule } from "@angular/core";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";

import { RecipeService } from "./recipes/recipe.service";

@NgModule({
    providers: [
        RecipeService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
    ]
})
export class CoreModule {

}