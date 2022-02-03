import { Recipe } from "./recipe.model";

export class RecipeService {

    private recipes:Recipe[] = [
        new Recipe('A Recipe for Meat', 'How to make tasty meat', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg'),
        new Recipe('A Recipe for Dumplings', 'How to make tasty dumplings', 'http://cdn.cnn.com/cnnnext/dam/assets/200811115525-04-best-polish-foods.jpg')
    ];

    getRecipes() {
        return this.recipes.slice(); // slice to prevent direct access
    }

}