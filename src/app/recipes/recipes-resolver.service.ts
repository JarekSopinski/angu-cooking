/**
 * Prevents error cause by not loading any recipes when we're on a path of a single recipe.
 */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";

import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions
    ){}

    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot)
        : 
        Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

            return this.store.select('recipes').pipe(
                take(1),
                map(
                    recipesState => {
                        return recipesState.recipes;
                    }
                ),
                switchMap(
                    recipes => {
                        // do not send any request if we already heave recipes
                        if (recipes.length === 0){
                            this.store.dispatch( new RecipeActions.FetchRecipes() );
                            return this.actions$.pipe(
                                ofType(RecipeActions.SET_RECIPES),
                                take(1) // we're only intereseted in this event once
                            );
                        } else {
                            return of(recipes);
                        }
                    }
                )
            );
                
    }

}