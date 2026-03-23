from pydantic import BaseModel
from typing import List


# =========={ frontend query objects }==========

class ItemCount(BaseModel):
    itemID: int
    itemQuantity: int


class ItemCountList(BaseModel):
    itemList: List[ItemCount]


# =========={ table and view objects }==========

class Recipe(BaseModel):
    recipeID: int
    recipeType: str
    resultQuantity: int
    pattern: str
    itemID: int


class Ingredient(BaseModel):
    RecipeID: int
    ItemID: int
    ItemQuantity: int
    PatternKey: str


class RecipeSearch(BaseModel):
    recipeid: int
    recipeitemid: int
    ingredientitemid: int
    recipetype: str
    pattern: str
    patternkey: str


# =========={ backend response objects }==========


class FullRecipe(BaseModel):
    recipe: Recipe
    ingredients: List[Ingredient]

class FullRecipeList(BaseModel):
    recipes: List[FullRecipe]
    itemList: List[ItemCount]


class RecipeSearchList(BaseModel):
    recipies: List[RecipeSearch]