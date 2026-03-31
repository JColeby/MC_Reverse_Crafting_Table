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
    recipe_set: set[RecipeSearch] = set()

    for curr_item in request:
        query_response: List[RecipeSearch] = get_recipeSearch_from_itemID(curr_item.itemid, cursor)
        for curr_recipe in query_response:
            if can_craft_recipe(request, curr_recipe) == True:
                recipe_set.add(curr_recipe)

    full_recipes: list[RecipeSearch] = [recipe for recipe in recipe_set]
    return FullRecipeList(recipes=full_recipes)

# =========={ Helpers }==========

def can_craft_recipe(provided_items: ItemCountList, recipe: FullRecipe) -> bool:
    """
    :param provided_items: List of ItemCounts that we can craft with
    :param recipe: The recipe we are testing against
    :return: True or False depending on if the items provided can craft said recipe
    """
    for curr_req_item in recipe.ingredients:
        match = next(
            (item for item in provided_items.itemlist if item.itemid == curr_req_item.itemid),
            None
        )
        if match is None or match.itemquantity < curr_req_item.itemquantity:
            return False
    return True