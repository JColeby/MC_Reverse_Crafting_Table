from database import *


def main(request: List[ItemCount], cursor) -> FullRecipeList:
    """
    Entry point for the reverse search algorithm.
    Takes a list of items and returns all the recipes needed to craft them,
    along with the total raw materials required.

    :param request: List of ItemCount objects representing the items to craft
    :param cursor: Database cursor
    :return: FullRecipeList containing all recipes and raw materials needed
    """
    recipe_set: set[FullRecipe] = set()
    raw_items: dict[int, int] = {}

    for item in request:
        ingredient_recipes, ingredient_item_map = get_next_recipe(item.itemid, item.itemquantity, [item.itemid], cursor)
        recipe_set.update(ingredient_recipes)
        raw_items = merge_item_map(raw_items, ingredient_item_map)

    full_recipes: list[FullRecipe] = [recipe for recipe in recipe_set]
    item_list: list[ItemCount] = [ItemCount(itemid=item, itemquantity=count) for item, count in raw_items.items()]
    return FullRecipeList(recipes=full_recipes, itemlist=item_list)


# =========={ Helpers }==========

def get_next_recipe(itemid: int, count: int, item_tree: list[int], cursor) -> tuple[set[FullRecipe], dict[int, int]]:
    """
    Recursively finds the best recipe for a given item, prioritizing
    smelting first, then stonecutting, then normal crafting.
    If no recipe is found, the item is treated as a raw material.

    :param itemid: The ID of the item to find a recipe for
    :param count: The number of this item needed
    :param item_tree: List of item/recipe IDs already visited, used to detect circular dependencies
    :param cursor: Database cursor
    :return: Tuple of (set of FullRecipe, dict of raw item counts)
    """
    recipes: list[Recipe] = get_recipe_from_itemID(itemid, cursor)

    # Prioritize smelting for items with raw ores
    smelting_recipes = get_ingredients(recipes, "smelting", count, item_tree, cursor)
    if smelting_recipes is not None:
        return smelting_recipes

    # Prioritize stonecutting next since it's always cheaper
    stonecutting_recipes = get_ingredients(recipes, "stonecutting", count, item_tree, cursor)
    if stonecutting_recipes is not None:
        return stonecutting_recipes

    # Fall back to normal crafting recipes
    normal_recipes = get_ingredients(recipes, None, count, item_tree, cursor)
    if normal_recipes is not None:
        return normal_recipes

    # No valid recipes found — this is a raw item
    return set(), {itemid: count}


def get_ingredients(recipes: list[Recipe], prioritize: Optional[str], count: int, item_tree: list[int], cursor
                    ) -> Optional[tuple[set[FullRecipe], dict[int, int]]]:
    """
    Attempts to find a valid set of ingredients for a list of recipes.
    Filters by recipe type if prioritize is specified. For each valid recipe,
    recursively resolves the ingredients needed to craft it.

    Uses a for/else pattern — the else block only runs if the ingredient loop
    completes without hitting a circular dependency (i.e. no break was triggered).
    If a circular dependency is detected, that recipe is skipped entirely.

    :param recipes: List of Recipe objects to search through
    :param prioritize: Recipe type to filter by (e.g. "smelting", "stonecutting"), or None for all types
    :param count: The number of the resulting item needed
    :param item_tree: List of item IDs already visited, used to detect circular dependencies
    :param cursor: Database cursor
    :return: Tuple of (set of FullRecipe, dict of raw item counts), or None if no valid recipe was found
    """
    for recipe in recipes:
        if prioritize is not None and recipe.recipetype != prioritize:
            continue

        recipe_set: set[FullRecipe] = set()
        raw_item_map: dict[int, int] = {}

        # Calculate how many times we need to craft this recipe
        true_count: int = count // recipe.resultquantity
        if count % recipe.resultquantity != 0:
            true_count += 1

        ingredients: list[Ingredient] = get_ingredient_from_recipeID(recipe.recipeid, cursor)
        recipe_set.add(FullRecipe(recipe=recipe, ingredients=ingredients))

        for ingredient in ingredients:
            if ingredient.itemid in item_tree:
                break  # circular dependency — skip this recipe

            ingredient_count: int = true_count * ingredient.itemquantity
            new_item_tree: list[int] = item_tree[:] + [ingredient.itemid]
            ingredient_recipes, ingredient_item_map = get_next_recipe(ingredient.itemid, ingredient_count, new_item_tree, cursor)
            recipe_set.update(ingredient_recipes)
            raw_item_map = merge_item_map(raw_item_map, ingredient_item_map)

        else:
            # Loop completed without hitting a circular dependency
            return recipe_set, raw_item_map

    return None


def merge_item_map(item_map_1: dict[int, int], item_map_2: dict[int, int]) -> dict[int, int]:
    """
    Merges two item count dictionaries together, summing the counts
    for any items that appear in both.

    :param item_map_1: Base item map to merge into
    :param item_map_2: Item map to merge from
    :return: The merged item map
    """
    for item, count in item_map_2.items():
        item_map_1[item] = item_map_1.get(item, 0) + count
    return item_map_1

