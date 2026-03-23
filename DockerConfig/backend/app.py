from fastapi import FastAPI
from contextlib import asynccontextmanager
# importing our files
import database
import forwardSearch
import reverseSearch
from Objects import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()   # runs on startup
    yield
    database.close_db()  # runs on shutdown


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def get_item_dictionary() -> dict:
    with database.get_cursor() as cursor:
        return database.get_all_items(cursor)


@app.post("/reverseSearch/")
async def reverse_search(request: ItemCountList) -> FullRecipeList:
    with database.get_cursor() as cursor:
        return reverseSearch.main(request.itemlist, cursor)


@app.post("/forwardSearch/")
async def forward_search(request: ItemCountList) -> RecipeSearchList:
    with database.get_cursor() as cursor:
        return forwardSearch.main(request.itemlist, cursor)
