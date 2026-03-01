

def main():
    ingredientIDs = []
    recipeIDs = []
    itemIDs = []

    with open("FormattedTables/IngredientTable.csv", "r") as file:
        lines = file.readlines()[1:]
        for line in lines:
            line = line.split(',')

            ingredientIDs.append(f"({line[0]}, {line[1]})")
    with open("FormattedTables/RecipeTable.csv", "r") as file:
        lines = file.readlines()[1:]
        for line in lines:
            line = line.split(',')
            recipeIDs.append(line[0])

    with open("FormattedTables/ItemTable.csv", "r") as file:
        lines = file.readlines()[1:]
        for line in lines:
            line = line.split(',')
            itemIDs.append(line[0])

    with open("../DeleteScript.txt", "w") as file:
        file.write(f"DELETE FROM public.ingredient WHERE (RecipeID, ItemID) IN (\n")
        file.write(",\n".join(ingredientIDs) + "\n);\n\n")
        file.write(f"DELETE FROM public.recipe WHERE RecipeID IN (\n")
        file.write(",\n".join(recipeIDs) + "\n);\n\n")
        file.write(f"DELETE FROM public.item WHERE ItemID IN (\n")
        file.write(",\n".join(itemIDs) + "\n);\n\n")


if __name__ == "__main__":
    main()
