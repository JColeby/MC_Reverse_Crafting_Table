from pydantic import BaseModel
from typing import List


# =========={ frontend query objects }==========

class ItemCount(BaseModel):
    itemid: int
    itemquantity: int


class ItemCountList(BaseModel):
    itemlist: List[ItemCount]


# =========={ table and view objects }==========

class Recipe(BaseModel):
    recipeid: int
    recipetype: str
    resultquantity: int
    pattern: str
    itemid: int


class Ingredient(BaseModel):
    recipeid: int
    itemid: int
    itemquantity: int
    patternkey: str


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
    itemlist: List[ItemCount]


class RecipeSearchList(BaseModel):
    recipies: List[RecipeSearch]