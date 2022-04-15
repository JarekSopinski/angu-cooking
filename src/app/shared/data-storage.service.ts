import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    apiUrl:string = "https://angu-cooking-default-rtdb.firebaseio.com/";

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http.put(
            `${this.apiUrl}/recipes.json`,
            recipes
        ).subscribe(
            response => console.log(response)
        )
    }

    fetchRecipes(){

        return this.http.get<Recipe[]>(
            `${this.apiUrl}/recipes.json`
        ).pipe(
            map(recipes => { // map from rxjs!
                return recipes.map(recipe => { // native map function!
                    // If Recipe has no ingredients, set it to an empty array to prevent errors.
                    return {
                        ...recipe, // spread other properties
                        ingredients: recipe.ingredients ? recipe.ingredients : [] // has any ingredients?
                    }
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
        
    }

}