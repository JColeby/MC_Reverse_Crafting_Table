import hashlib
import csv
import json

RECIPE_TB = [["recipeID", "recipeType", "resultQuantity", "pattern", "ItemID"]]
ITEM_TB = [["itemID", "itemName"]]
INGREDIENT_TB = [["recipeID", "itemID", "itemQuantity","patternKey"]]

TAG_SET = []    # so we know what tags we need to update
RECIPE_HASH_SET = []    # so we don't get duplicates of the same recipe
BAD_RECIPE = []    # contains the recipies that gave us System.Object[]

NEXT_RECIPE_ID = 1  # TODO: Make sure this is set to the next recipeID in the sequence (run "SELECT nextval('recipe_recipeid_seq');" to find this number)
NEXT_ITEM_ID = 1    # TODO: Make sure this is set to the next ItemID in the sequence (run "SELECT nextval('item_itemid_seq');" to find this number)
ITEM_NAME_TO_ID = {}    # key is the name as seen in the raw file


# ==============={ Table Formatting Functions }===============

def addItemToTable(itemName):
    if "[" in itemName:   # checking if it is a list of items
        if itemName == "System.Object[]":
            raise RuntimeError
        itemName = json.loads(itemName)[0]

    if itemName[0] == "#" and itemName not in TAG_SET:
        TAG_SET.append(itemName)
        # TODO: add code that gets a corresponding item to use as the itemName
    # itemName = itemName.split(":")[1]     # commented for now so we know which items are tags within the item table

    if itemName not in ITEM_NAME_TO_ID.keys():
        global NEXT_ITEM_ID
        ITEM_NAME_TO_ID[itemName] = NEXT_ITEM_ID
        ITEM_TB.append([NEXT_ITEM_ID, itemName])
        NEXT_ITEM_ID += 1

    return ITEM_NAME_TO_ID[itemName]


def addIngredientToTable(recipeID, itemName, quantity, patternKey=None):
    itemID = addItemToTable(itemName)
    INGREDIENT_TB.append([recipeID, itemID, quantity,patternKey])


def addRecipeToTable(recipeID, recipeType, result, pattern=None):
    recipeResult = result[2:-1].split("; ")
    quantity = 1
    itemName = ""
    for item in recipeResult:  # doing this because the data is stored as an inconsistent malformed dictionary
        if "count=" in item:
            quantity = item.split("=")[1].strip("'")
        if "id=" in item:
            itemName = item.split("=")[1]
    itemID = addItemToTable(itemName)

    RECIPE_TB.append([recipeID, recipeType, quantity, pattern, itemID])


# ==============={ Recipe Specific Functions }===============

def addShapedRecipe(recipeID, recipeType, entry):
    rawPattern = json.loads(entry[4])    # rows are combined into 1 string as we are just getting the count
    formattedPattern = ""
    if isinstance(rawPattern, list):
        for row in rawPattern:
            while len(row) != 3:
                row += " "
            formattedPattern += row
    else:
        formattedPattern += rawPattern
    while len(formattedPattern) != 9:
        formattedPattern += " "

    ingredientCounts = {}
    for char in formattedPattern:
        if char == " ":
            continue
        if char in ingredientCounts.keys():
            ingredientCounts[char] += 1
        else:
            ingredientCounts[char] = 1

    recipeKey = entry[1][2:-1].split("; ")  # formats as a list like this: ['#=minecraft:terracotta', 'X=minecraft:yellow_dye']
    for ingredient in recipeKey:
        ingredient = ingredient.split("=")
        quantity = ingredientCounts[ingredient[0]]
        addIngredientToTable(recipeID, ingredient[1], quantity, ingredient[0])

    addRecipeToTable(recipeID, recipeType, entry[5], formattedPattern)


def addShaplessRecipe(recipeID, recipeType, entry):
    recipeIngredients = json.loads(entry[6])
    if not isinstance(recipeIngredients, list): # recipies
        recipeIngredients = [recipeIngredients]

    ingredientCount = {}
    for ingredient in recipeIngredients:
        if isinstance(ingredient, dict):
            ingredient = ingredient["value"][0]
        if ingredient in ingredientCount.keys():
            ingredientCount[ingredient] += 1
        else:
            ingredientCount[ingredient] = 1

    for ingredient in ingredientCount.keys():
        addIngredientToTable(recipeID, ingredient, ingredientCount[ingredient])

    addRecipeToTable(recipeID, recipeType, entry[5])


def addTransformativeRecipe(recipeID, recipeType, entry):
    addIngredientToTable(recipeID, entry[7], 1)
    addRecipeToTable(recipeID, recipeType, entry[5])


# ==============={ Additional Function }===============

def readRawData():
    with open('SourceFiles/RawRecipeData.csv', mode='r', newline='') as csv_file:
        csv_file.readline()
        csvReader = csv.reader(csv_file, delimiter=',')
        rawRecipeData = [row for row in csvReader]
    return rawRecipeData


def addEntry(entry):
    # type, key, category, group, pattern, result, ingredients, ingredient, experience,
    # cookingtime, input, material, addition, template, base, show_notification
    entryString = ",".join(entry)
    recipeHash = hashlib.md5(entryString.encode('utf-8')).hexdigest()
    if recipeHash in RECIPE_HASH_SET:
        return
    RECIPE_HASH_SET.append(recipeHash)

    global NEXT_RECIPE_ID
    try:
        recipeType = entry[0].split(":")[1]
        if recipeType == "crafting_shaped":
            addShapedRecipe(NEXT_RECIPE_ID, recipeType, entry)
        elif recipeType == "crafting_shapeless":
            addShaplessRecipe(NEXT_RECIPE_ID, recipeType, entry)
        elif recipeType == "smelting" or recipeType == "stonecutting":
            addTransformativeRecipe(NEXT_RECIPE_ID, recipeType, entry)
        else:
            return
    except RuntimeError:
        BAD_RECIPE.append(entryString)
        return

    NEXT_RECIPE_ID += 1

def updateNoneTypes(item):
    if item == None:
        return "NULL"
    return f"\'{item}\'"


# ==============={ Main Function }===============

def main():
    rawRecipeData = readRawData()
    for entry in rawRecipeData:
        addEntry(entry)

    recipeInsertValues = []
    ingredientInsertValues = []
    itemInsertValues = []

    with open("FormattedTables/RecipeTable.csv", "w") as file:
        file.write("INSERT INTO RECIPE (RecipeID, RecipeType, ResultQuantity, Pattern, ItemID) VALUES\n")
        for item in RECIPE_TB:
            item[3] = updateNoneTypes(item[3])
            file.write(f"({item[0]},{item[1]},{item[2]},{item[3]},{item[4]})\n")
            recipeInsertValues.append(f"({item[0]},'{item[1]}',{item[2]},{item[3]},{item[4]})")

    with open("FormattedTables/IngredientTable.csv", "w") as file:
        for item in INGREDIENT_TB:
            item[3] = updateNoneTypes(item[3])
            file.write(f"{item[0]},{item[1]},{item[2]},{item[3]}\n")
            ingredientInsertValues.append(f"({item[0]},{item[1]},{item[2]},{item[3]})")

    with open("FormattedTables/ItemTable.csv", "w") as file:
        for item in ITEM_TB:
            file.write(f"{item[0]},{item[1]}\n")
            itemInsertValues.append(f"({item[0]},'{item[1]}')")

    with open("../InsertScript.txt", "w") as file:
        file.write("INSERT INTO public.item (itemID, ItemName) VALUES\n")
        file.write(',\n'.join(itemInsertValues[1:]) + ";\n\n")
        # file.write("ON CONFLICT (ItemID) DO NOTHING;\n\n")

        file.write("INSERT INTO public.recipe (RecipeID, RecipeType, ResultQuantity, Pattern, ItemID) VALUES\n")
        file.write(',\n'.join(recipeInsertValues[1:]) + ";\n\n")
        # file.write("ON CONFLICT (RecipeID) DO NOTHING;\n\n")

        file.write("INSERT INTO public.ingredient (RecipeID, ItemID, ItemQuantity, PatternKey) VALUES\n")
        file.write(',\n'.join(ingredientInsertValues[1:]) + ";\n\n")

        # because we are manually setting the ID's in our InsertScript, we need to ensure the next sequence generated is above the values we inserted
        file.write("SELECT setval('item_itemid_seq', (SELECT MAX(ItemID) FROM public.item));\n")
        file.write("SELECT setval('recipe_recipeid_seq', (SELECT MAX(RecipeID) FROM public.recipe));\n")


    with open("AdditionalOutput/TagsPresent.csv", "w") as file:
        for item in TAG_SET:
            file.write(f"{item}\n")

    with open("AdditionalOutput/BadRecipies.csv", "w") as file:
        for item in BAD_RECIPE:
            file.write(f"{item}\n")


if __name__ == "__main__":
    main()
