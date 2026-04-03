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
    resultquantity: Optional[int] = None
    pattern: Optional[str] = None
    itemid: int

    def __eq__(self, other):
        return isinstance(other, Recipe) and self.recipeid == other.recipeid

    def __hash__(self):
        return hash(self.recipeid)


class Ingredient(BaseModel):
    recipeid: int
    itemid: int
    itemquantity: int
    patternkey: Optional[str] = None
    
class RecipeSearchIngredient(BaseModel):
    itemid: int
    patternkey: Optional[str] = None
    itemquantity: int


class RecipeSearch(BaseModel):
    recipeid: int
    recipeitemid: int
    ingredientitemid: int
    recipetype: str
    pattern: Optional[str] = None
    patternkey: Optional[str] = None

    def __eq__(self, other):
        return isinstance(other, RecipeSearch) and self.recipeid == other.recipeid
    
    def __hash__(self):
        return hash(self.recipeid)

# =========={ backend response objects }==========


class FullRecipe(BaseModel):
    recipe: Recipe
    ingredients: List[Ingredient]

    def __eq__(self, other):
        return isinstance(other, FullRecipe) and self.recipe == other.recipe

    def __hash__(self):
        return hash(self.recipe)
    
class FullRecipeSearch(BaseModel):
    recipe: Recipe
    ingredients: List[RecipeSearchIngredient]


class FullRecipeList(BaseModel):
    recipes: List[FullRecipe]
    itemlist: List[ItemCount]


class RecipeSearchList(BaseModel):
    recipes: List[FullRecipeSearch]

