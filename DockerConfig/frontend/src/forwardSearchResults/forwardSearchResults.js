import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function ReverseSearchResults() {
  const { state } = useLocation();
  const sendToApi = state?.apiData;
  const craftIDs = state?.craftIDs;

  const [data, setData] = useState();
  const getName = (id) =>
    craftIDs?.[id]
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase()) || `Item ${id}`;

  useEffect(() => {
    if (!sendToApi?.length) return;

    fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ItemList: sendToApi })
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [sendToApi]);

  return (
    <div>
      <h2>Reverse Search Results</h2>

      {data?.recipes?.map((r, i) => (
        <div key={i} style={{ margin: 20, padding: 10, border: "1px solid #ccc" }}>
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

      <h3>Raw Materials</h3>
      <ul>
        {data?.itemlist?.map((item, i) => (
          <li key={i}>
            {getName(item.itemid)} × {item.itemquantity}
          </li>
        )) || "Loading..."}
      </ul>
    </div>
  );
}
