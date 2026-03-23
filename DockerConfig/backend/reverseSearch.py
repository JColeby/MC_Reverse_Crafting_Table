from database import *


def main(request: List[ItemCount], cursor) -> FullRecipeList:
    """Jonathan will work on this since it has all the weird recursion"""
    recipes = []
    fullRecipes = []
    for item in request:
        recipes.append(get_recipe_from_itemID(item.itemid, cursor))
    for recipe in recipes:
        ingredients = get_ingredient_from_recipeID(recipe[0].recipeid, cursor)
        fullRecipes.append(FullRecipe(recipe=recipe[0], ingredients=ingredients))
    return FullRecipeList(recipes=fullRecipes,itemlist=request)
