import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'; // save action's name to variable to rule out manual typing

export class AddIngredient implements Action {

    readonly type = ADD_INGREDIENT;
    payload: Ingredient;

}