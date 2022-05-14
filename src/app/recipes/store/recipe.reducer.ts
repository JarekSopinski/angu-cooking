import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipeReducer(
    state = initialState, 
    action: RecipesActions.RecipesActionsType
    ) {

    switch (action.type){

        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }

        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }

        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipe = { 
                ...state.recipes[action.payload.index], // copy all existing properties from old recipe
                ...action.payload.newRecipe // extract updated properties and merge them into updated recipe
            };
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe; // overwrite updated recipe

            return {
                ...state,
                recipes: updatedRecipes
            }

        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter( (recipe, index) => { return index !== action.payload; } )
            }

        default:
            return state;

    }

}