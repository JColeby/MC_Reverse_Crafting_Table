# Backend
This contains all the code for our backend, which is written in python.
Our backend is build upon fastapi, and queries the database using psycopg2.

## app.py
This contains the code for our api endpoints. 
Here are the details for each endpoint:
* "/"
  * This endpoint will query the item table in the database, and will return a dictionary that maps itemID to itemName
  * this will be returned in the following format:
```json
{
  "Item1": 1,
  "Item2": 2,
  "Item3": 3
}
```
* "/reverseSearch/"
  * This endpoint is to be called using a POST request. 
  * It takes in an ItemCountList object, which should be passed in as a JSON object via the request body.
  * This will return a FullRecipeList object. See sample JSON for this object under Objects.py
* "/forwardSearch/"
  * This endpoint is to be called using a POST request. 
  * It takes in an ItemCountList object, which should be passed in as a JSON object via the request body
  * Currently returns a RecipeSearchList object, however this may change in the future


## database.py
This contains functions that will query the database. 
All function calls require that you pass in the cursor object that was declared in the initial api function (typically passed in at the very end).
Most functions will also require that you pass in an ID that corresponds to the item you are requesting.
Most functions are also built using a higher-order function, which takes in the sql statement and an object that will store the resulting data.


## Objects.py
This file contains all the backend objects.
Here is some sample json for all the objects that are either passed in by the frontend or returned by the backend:
* ItemCountList - passed into all the endpoints
```json
{
  "itemList": [
    { "itemID": 101, "itemQuantity": 3 },
    { "itemID": 202, "itemQuantity": 1 }
  ]
}
```
* RecipeSearchList - returned by the forwardSearch endpoint
```json
{
  "recipies": [
    {
      "recipeid": 1,
      "recipeitemid": 101,
      "ingredientitemid": 202,
      "recipetype": "crafting",
      "pattern": "XXX",
      "patternkey": "X"
    },
    {
      "recipeid": 1,
      "recipeitemid": 101,
      "ingredientitemid": 203,
      "recipetype": "crafting",
      "pattern": "XXX",
      "patternkey": "X"
    },
    {
      "recipeid": 2,
      "recipeitemid": 102,
      "ingredientitemid": 204,
      "recipetype": "smelting",
      "pattern": "X_X",
      "patternkey": "X"
    },
    {
      "recipeid": 2,
      "recipeitemid": 102,
      "ingredientitemid": 205,
      "recipetype": "smelting",
      "pattern": "X_X",
      "patternkey": "_"
    }
  ]
}
```
* FullRecipeList - returned by the reverseSearch endpoint
```json
{
  "recipes": [
    {
      "recipe": {
        "recipeID": 1,
        "recipeType": "crafting",
        "resultQuantity": 1,
        "pattern": "XXX",
        "itemID": 101
      },
      "ingredients": [
        { "RecipeID": 1, "ItemID": 202, "ItemQuantity": 3, "PatternKey": "X" },
        { "RecipeID": 1, "ItemID": 203, "ItemQuantity": 1, "PatternKey": "X" }
      ]
    },
    {
      "recipe": {
        "recipeID": 2,
        "recipeType": "smelting",
        "resultQuantity": 4,
        "pattern": "X_X",
        "itemID": 102
      },
      "ingredients": [
        { "RecipeID": 2, "ItemID": 204, "ItemQuantity": 1, "PatternKey": "X" },
        { "RecipeID": 2, "ItemID": 205, "ItemQuantity": 2, "PatternKey": "_" }
      ]
    }
  ],
  "itemList": [
    { "itemID": 202, "itemQuantity": 3 },
    { "itemID": 203, "itemQuantity": 1 },
    { "itemID": 204, "itemQuantity": 1 },
    { "itemID": 205, "itemQuantity": 2 }
  ]
}
```

## forwardSearch.py and reverseSearch.py
These files contain the code that will retrieve and format the code from the database.
They haven't been written yet.