import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'; // save action's name to variable to rule out manual typing
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

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

export class UpdateIngredient implements Action {

    readonly type = UPDATE_INGREDIENT;
    constructor(
        public payload: {index: number, ingredient: Ingredient}
    ) {}

}

export class DeleteIngredient implements Action {

    readonly type = DELETE_INGREDIENT;
    constructor(
        public payload: number
    ) {}

}

// Create new type for TS to recognize all our Actions
export type ShoppingListActionsType = 
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient;