from typing import List, Dict, Set

from Objects import ItemCount, RecipeSearch, Recipe, RecipeSearchIngredient, FullRecipeSearch, RecipeSearchList
import database


def main(request: List[ItemCount], cursor) -> RecipeSearchList:
    """
    Entry point for the forward search algorithm.
    Takes a list of items and returns all the recipes you can make using them.
    It does not recursively search - it only finds recipes that you can make currently.

    :param request: List of objects containing item ID and their count
    :param cursor: DB cursor needed for calling database functions
    :return: List of all recipes you can craft using given items (RecipeSearchList)
    """
    recipe_dict: Dict[int, FullRecipeSearch] = {}

    # collect all recipe IDs that use any of the requested items
    recipes_to_consider: Set[int] = set()

    for curr_item in request:
        query_response: List[RecipeSearch] = database.get_recipeSearch_from_itemID(
            curr_item.itemid, cursor
        )
        for curr_recipe in query_response:
            recipes_to_consider.add(curr_recipe.recipeid)

    # for each recipe that uses any of those items, build it once with ALL ingredients
    for recipe_id in recipes_to_consider:
        recipe_from_db = database.get_recipe_from_recipeID(recipe_id, cursor)[0]

        new_rec = Recipe(
            recipeid=recipe_id,
            recipetype=recipe_from_db.recipetype,
            resultquantity=recipe_from_db.resultquantity,
            pattern=recipe_from_db.pattern,
            itemid=recipe_from_db.itemid,
        )

        # get all ingredients for this recipe (as `Ingredient` rows)
        all_ing_rows = database.get_ingredient_from_recipeID(recipe_id, cursor)

        # convert `Ingredient` → `RecipeSearchIngredient` for the response
        all_search_ings = [
            RecipeSearchIngredient(itemid=ing.itemid, patternkey=ing.patternkey, itemquantity=ing.itemquantity)
            for ing in all_ing_rows
        ]

        new_full_rec = FullRecipeSearch(
            recipe=new_rec,
            ingredients=all_search_ings,
        )
        recipe_dict[recipe_id] = new_full_rec

    return RecipeSearchList(recipes=list(recipe_dict.values()))