import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions"; // import all

const initialState = {

    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
        new Ingredient('Potatoes', 15)
    ]

}

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListActions.ShoppingListActionsType
    ) {

    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT: // use variable, not string, to rule out manual typing
            return {
                ...state, // include previous state
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }
        default:
            return state;
    }

}