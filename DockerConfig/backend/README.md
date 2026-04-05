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
  "item1": 1,
  "item2": 2,
  "item3": 3
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
  "itemlist": [
    { "itemid": 101, "itemquantity": 3 },
    { "itemid": 202, "itemquantity": 1 }
  ]
}
```
* RecipeSearchList - returned by the forwardSearch endpoint
```json
{
  "recipes": [
    {
      "recipe": {
        "recipeid": 1,
        "recipetype": "crafting",
        "resultquantity": 4,
        "pattern": "XXXX XXXX",
        "itemid": 101
      },
      "ingredients": [
        {
          "itemid": 201,
          "patternkey": "X",
          "itemquantity": 8
        }
      ]
    },
    {
      "recipe": {
        "recipeid": 2,
        "recipetype": "smelting",
        "resultquantity": 1,
        "pattern": null,
        "itemid": 102
      },
      "ingredients": [
        {
          "itemid": 202,
          "patternkey": null,
          "itemquantity": 2
        },
        {
          "itemid": 203,
          "patternkey": null,
          "itemquantity": 1
        }
      ]
    },
    {
      "recipe": {
        "recipeid": 3,
        "recipetype": "crafting",
        "resultquantity": null,
        "pattern": "AB BA    ",
        "itemid": 103
      },
      "ingredients": [
        {
          "itemid": 204,
          "patternkey": "A",
          "itemquantity": 2
        },
        {
          "itemid": 205,
          "patternkey": "B",
          "itemquantity": 2
        }
      ]
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
        "recipeid": 1,
        "recipetype": "crafting",
        "resultquantity": 1,
        "pattern": "XXX",
        "itemid": 101
      },
      "ingredients": [
        { "recipeid": 1, "itemid": 202, "itemquantity": 3, "patternkey": "X" },
        { "recipeid": 1, "itemid": 203, "itemquantity": 1, "patternkey": "X" }
      ]
    },
    {
      "recipe": {
        "recipeid": 2,
        "recipetype": "smelting",
        "resultquantity": 4,
        "pattern": "X_X",
        "itemid": 102
      },
      "ingredients": [
        { "recipeid": 2, "itemid": 204, "itemquantity": 1, "patternkey": "X" },
        { "recipeid": 2, "itemid": 205, "itemquantity": 2, "patternkey": "_" }
      ]
    }
  ],
  "itemlist": [
    { "itemid": 202, "itemquantity": 3 },
    { "itemid": 203, "itemquantity": 1 },
    { "itemid": 204, "itemquantity": 1 },
    { "itemid": 205, "itemquantity": 2 }
  ]
}
```

## forwardSearch.py and reverseSearch.py
These files contain the code that will retrieve and format the code from the database. Both of the files have detailed docstrings that describe the logic used to retrieve and format the data from the database.
