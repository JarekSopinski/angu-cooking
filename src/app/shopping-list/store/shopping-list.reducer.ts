import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions"; // import all

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

export interface AppState {
    shoppingList: State;
}

const initialState: State = {

    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
        new Ingredient('Potatoes', 15)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1, // -1 is not a valid index

}

export function shoppingListReducer(
    state: State = initialState, 
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

        case ShoppingListActions.UPDATE_INGREDIENT:
            const editedIngredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...editedIngredient,
                ...action.payload.ingredient
            };

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== action.payload;
                })
            };

        default:
            return state;
    }

}