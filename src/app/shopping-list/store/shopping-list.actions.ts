import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'; // save action's name to variable to rule out manual typing
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';

export class AddIngredient implements Action {

    readonly type = ADD_INGREDIENT;
    constructor(
        public payload: Ingredient // has to be public to access payload from reducer
        ) {}

}

export class AddIngredients implements Action {

    readonly type = ADD_INGREDIENTS;
    constructor(
        public payload: Ingredient[]
        ) {}

}

// Create new type for TS to recognize all our Actions
export type ShoppingListActionsType = AddIngredient | AddIngredients;