import { useNavigate } from "react-router-dom";

/* This function creates a grid for the recipe passed in.
   The grid is a 3x3 that represents what a shaped crafting
   recipe would look like in game.
   All recipes, including shaped ones, will also include the
   items required to craft the item and will have a button
   that will navigate to /rsr with the recipe on that recipe card
   as the correct JSON object to get sent to the API. */
export function RecipeCard({ recipe, getName, craftIDs }) {
  const { recipe: r, ingredients } = recipe;
  const navigate = useNavigate();

  // Gets the name of the associated itemID
  const keyToName = {};
  ingredients.forEach(ing => {
    if (ing.patternkey) keyToName[ing.patternkey] = getName(ing.itemid);
  });

  return (
    <div style={{ margin: "20px auto", padding: 10, border: "1px solid #8b8b8b",
    backgroundColor: "#c6c6c6", display:"flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

        <h3 style={{ margin: 0 }}>{getName(r.itemid)}</h3>
        <p style={{ margin: 0 }}>{r.recipetype}</p>

      </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        
        {// This is where the 3x3 grid starts
        r.pattern && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)", gap: 4 }}>
          {r.pattern.split("").map((char, i) => (

            <div key={i} title={keyToName[char] || ""} style={{
              width: 50, height: 50,
              background: "#8b8b8b",
              border: "1px solid #999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, textAlign: "center"
            }}>

              {char === " " ? "" : (keyToName[char] ?? char)}
            </div>
          ))}
        </div>
      )}

      <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
        {ingredients.map((ing, j) => (
          <li key={j}> {getName(ing.itemid)} × {ing.itemquantity} </li>
        ))}
      </ul>
      
      <button
          onClick={() => {
            if (r?.itemid != null) {
              navigate("/rsr", {
                state: { apiData: [{ itemid: r.itemid, itemquantity: 1 }], craftIDs }
              });}}}> Find raw materials </button>
    </div>
    </div>
  );
}
