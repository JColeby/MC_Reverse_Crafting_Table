import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from contextlib import contextmanager

from typing import TypeVar, Type, Callable
from Objects import *

load_dotenv()
conn = None

# =========={ Setup }==========

def init_db():
    global conn
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )


@contextmanager
def get_cursor():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        yield cursor
    finally:
        cursor.close()


def close_db():
    if conn:
        conn.close()


# =========={ Database Request Functions }==========


def get_all_items(cursor) -> dict:
    cursor.execute("SELECT * FROM item")
    rows = cursor.fetchall()
    item_dictionary = {}
    for row in rows:
        item_dictionary[row["itemname"]] = row['itemid']
    return item_dictionary


T = TypeVar("T", bound=BaseModel)


def make_query_by_id(sql: str, tableObj: Type[T]) -> Callable:
    """
    This is a higher order function that takes in a sql query as a string
    and the object type to convert the resulting items to (this object
    type should be a 1-to-1 reflection of the table rows), and returns
    a function that takes in an itemID, queries the database using that ID,
    and returns a list of all the results.

    The object class that gets passed in should inherit BaseModel

    here is a sudo doctest on how you would use this (the %s in the sql query
    represents the id that you will pass in when calling the new function
    >>> get_ingredients_from_recipeID = make_query_by_id("SELECT * FROM public.ingredient WHERE RecipeID = %s;", Ingredient)
    >>> get_ingredients_from_recipeID(1)
    ['list of all the ingredients associated with recipie 1']
    """
    def query(id: int, cursor) -> list[T]:
        cursor.execute(sql, (id,))
        rows = cursor.fetchall()
        return [tableObj(**row) for row in rows]
    return query


# These are functions you can call!
get_ingredient_from_recipeID = make_query_by_id("SELECT * FROM ingredient WHERE RecipeID = %s;", Ingredient)
get_recipe_from_itemID = make_query_by_id("SELECT * FROM recipe WHERE ItemID = %s;", Recipe)
get_recipeSearch_from_itemID = make_query_by_id("SELECT * FROM RecipeSearch WHERE ItemID = %s;", RecipeSearch)