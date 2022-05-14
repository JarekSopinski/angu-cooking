/**
 * Fetching recipes from API as a side effect or Recipe Store.
 */

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";

import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

    apiUrl:string = "https://angu-cooking-default-rtdb.firebaseio.com/";

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(
            () => {
                return this.http.get<Recipe[]>(
                    `${this.apiUrl}/recipes.json`
                )
            }
        ),
        map(recipes => {
            return recipes.map(recipe => { // native map function!
                // If Recipe has no ingredients, set it to an empty array to prevent errors.
                return {
                    ...recipe, // spread other properties
                    ingredients: recipe.ingredients ? recipe.ingredients : [] // has any ingredients?
                }
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) {}

}