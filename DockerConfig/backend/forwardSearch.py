from database import *


def main(request: List[ItemCount], cursor) -> RecipeSearchList:
    """
    Entry point for the forward search algorithm.
    Takes a list of items and returns all the recipes you can make using them
    It does not recursively search - it only finds recipes that you can make currently
    
    :param request: This is a list of objects containing an item ID and their count
    :param cursor: This is needed whenever you call a database function, pass it in as
                    the second parameter
    :return RecipeSearchList: returns a list of all the recipes you can craft using given items
    """
    recipe_list: List[FullRecipeSearch] = list()

    for curr_item in request:
        query_response: List[RecipeSearch] = get_recipeSearch_from_itemID(curr_item.itemid, cursor)
        for curr_recipe in query_response:
            if not recipe_list or curr_recipe.recipeid not in [recipe.recipe.recipeid for recipe in recipe_list]:
                new_rec = Recipe(
                    recipeid = curr_recipe.recipeid,
                    itemid = curr_recipe.recipeitemid,
                    recipetype = curr_recipe.recipetype,
                    pattern = curr_recipe.pattern
                )
                new_ing = make_ingredient(curr_recipe)
                new_full_rec = FullRecipeSearch(
                    recipe = new_rec,
                    ingredients = [new_ing]               
                )
                recipe_list.append(new_full_rec)
            else:
                for recipe in recipe_list:
                    if recipe.recipe.itemid == curr_recipe.recipeitemid:
                        add_ing = make_ingredient(curr_recipe)
                        recipe.ingredients.append(add_ing)
                    
    return RecipeSearchList(recipes=recipe_list)

# =========={ Helpers }==========

def make_ingredient(provided_recipe: RecipeSearch) -> RecipeSearchIngredient:
    new_ing = RecipeSearchIngredient(
        itemid = provided_recipe.ingredientitemid,
        patternkey = provided_recipe.patternkey   
    )
    return new_ing