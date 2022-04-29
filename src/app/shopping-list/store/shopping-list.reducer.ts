import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import { ADD_INGREDIENT } from "./shopping-list.actions";

const initialState = {

    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
        new Ingredient('Potatoes', 15)
    ]

}

export function shoppingListReducer(state = initialState, action: Action) {

    switch(action.type) {
        case ADD_INGREDIENT: // use variable, not string, to rule out manual typing
            return {
                ...state, // include previous state
                ingredients: [...state.ingredients, action]
            };
    }

}