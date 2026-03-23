from pydantic import BaseModel
from typing import List, Optional



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
    pattern: Optional[str] = None
    itemid: int


class Ingredient(BaseModel):
    recipeid: int
    itemid: int
    itemquantity: int
    patternkey: Optional[str] = None


class RecipeSearch(BaseModel):
    recipeid: int
    recipeitemid: int
    ingredientitemid: int
    recipetype: str
    pattern: Optional[str] = None
    patternkey: Optional[str] = None


# =========={ backend response objects }==========


class FullRecipe(BaseModel):
    recipe: Recipe
    ingredients: List[Ingredient]

class FullRecipeList(BaseModel):
    recipes: List[FullRecipe]
    itemlist: List[ItemCount]


class RecipeSearchList(BaseModel):
    recipies: List[RecipeSearch]

