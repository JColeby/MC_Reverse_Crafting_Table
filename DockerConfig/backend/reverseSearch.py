from database import *


def main(request: List[ItemCount], cursor) -> FullRecipeList:
    recipeSet = set()
    rawItems = {}
    for item in request:
        ingredientRecipies, ingredientItemMap = get_next_recipe(item.itemid, item.itemquantity, [item.itemid], cursor)
        recipeSet.update(ingredientRecipies)
        rawItems = merge_item_map(rawItems, ingredientItemMap)

    fullRecipes = [recipe for recipe in recipeSet]
    itemList = [ItemCount(itemid=item, itemquantity=count) for item, count in rawItems.items()]
    return FullRecipeList(recipes=fullRecipes, itemlist=itemList)


def get_next_recipe(itemid: int, count: int, itemTree: list, cursor):
    recipes = get_recipe_from_itemID(itemid, cursor)

    # prioritizes smelting for items with raw ores
    smeltingRecipes = get_ingredients(recipes, "smelting", count, itemTree, cursor)
    if smeltingRecipes is not None:
        return smeltingRecipes

    # prioritizes stonecutting next since its always cheaper
    stonecuttingRecipes = get_ingredients(recipes, "stonecutting", count, itemTree, cursor)
    if stonecuttingRecipes is not None:
        return stonecuttingRecipes

    normalRecipes = get_ingredients(recipes, None, count, itemTree, cursor)
    if normalRecipes is not None:
        return normalRecipes

    # if there are no valid recipies, then we have a raw item
    return set(), {itemid: count}


def get_ingredients(recipes, prioritize, count: int, itemTree: list, cursor):
    for recipe in recipes:
        if prioritize is not None and recipe.recipetype != prioritize:
            continue

        recipeSet = set()
        rawItemMap = {}
        trueCount = count // recipe.resultquantity
        if count % recipe.resultquantity != 0:
            trueCount += 1

        itemTree.append(recipe.recipeid)
        ingredients = get_ingredient_from_recipeID(recipe.recipeid, cursor)
        recipeSet.add(FullRecipe(recipe=recipe, ingredients=ingredients))

        for ingredient in ingredients:
            ingredientCount = trueCount * ingredient.itemquantity
            if ingredient.itemid in itemTree:
                break
            newItemTree = itemTree[:] + [ingredient.itemid]
            ingredientRecipies, ingredientItemMap = get_next_recipe(ingredient.itemid, ingredientCount, newItemTree, cursor)
            recipeSet.update(ingredientRecipies)
            rawItemMap = merge_item_map(rawItemMap, ingredientItemMap)
        else:   # this only runs if we don't break out of the for loop above, which is kinda cool
            return recipeSet, rawItemMap
    return None


def merge_item_map(itemMap1: dict, itemMap2: dict):
    for item in itemMap2.keys():
        if item not in itemMap1.keys():
            itemMap1[item] = itemMap2[item]
        else:
            itemMap1[item] += itemMap2[item]
    return itemMap1



