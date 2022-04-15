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
        
        return this.authService.user.pipe(
            take(1), // With rxjs operator take() we take only one value from that sub. and then automaticly unsubscribe.
            exhaustMap(user => {
                /**
                 * exhaustMap waits for the first observable to complete, which will happen after we took the latest user
                 * Then it gives us that user, then we get the data from the previous observable
                 * and now we return a new observable in there, which will then replace previous observable in the
                 * entire observable chain.
                 * So basicly we merge two observables.
                 * Than .map() and .tap() can be added as next steps in the same chain.
                 */
                 return this.http.get<Recipe[]>(
                    `${this.apiUrl}/recipes.json`,
                    {
                        params: new HttpParams().set('auth', user.token)
                    }
                )
            }),
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