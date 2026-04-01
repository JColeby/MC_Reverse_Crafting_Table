import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeCard } from "../commonFunctions/commonFunctions";

export function ReverseSearchResults() {
  const { state } = useLocation();
  const sendToApi = state?.apiData;
  const craftIDs = state?.craftIDs;

  const [data, setData] = useState();

  // combine name lookup + formatting into one function
  function getName(id) {
    // craftIDs?.[id]
    //   ?.replace(/_/g, " ")
    //   .replace(/\b\w/g, c => c.toUpperCase()) || `Item ${id}`;
    const selectedName = craftIDs.find(
      ([key, value]) => value === Number(id)
    )?.[0]?.split("minecraft:")[1] || "Unknown";

    // Make name human readable
    const readableName = selectedName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
      return readableName;
    };

  useEffect(() => {
    if (!sendToApi?.length) return;

    fetch("http://localhost:8000/reverseSearch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemlist: sendToApi })
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [sendToApi]);

  return (
    <div>
      <h2 className="App-form">Reverse Search Results</h2>

      {data?.recipes?.map((r, i) => (
        <div key={i} style={{ margin: 20, padding: 10, border: "1px solid #ccc", backgroundColor: "#C6C6C6" }}>
          <h3>{getName(r.recipe.itemid)}</h3>
          <p>{r.recipe.recipetype}</p>

          <ul>
            {r.ingredients.map((ing, j) => (
              <li key={j}>
                {getName(ing.itemid)} × {ing.itemquantity}
              </li>
            ))}
          </ul>
        </div>
      )) || "Loading..."}
      <div className="App-form">
      <h3>Raw Materials</h3>
      <ul>
        {data?.recipes?.map((r, i) => (
            <RecipeCard key={i} recipe={r} getName={getName} />
        )) || "Loading..."}
      </ul>
      </div>
    </div>
  );
}
