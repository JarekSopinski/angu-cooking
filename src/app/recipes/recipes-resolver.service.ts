/**
 * Prevents error cause by not loading any recipes when we're on a path of a single recipe.
 */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService
    ){}

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot)
        : 
        Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

            return this.dataStorageService.fetchRecipes();
        
    }

}