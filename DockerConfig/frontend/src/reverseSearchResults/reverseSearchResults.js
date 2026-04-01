import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function ReverseSearchResults() {
  const location = useLocation();
  const sendToApi = location.state?.apiData;

  const [apiResponseData, setApiRD] = useState();

  useEffect(() => {
    async function loadAPI() {
      if (!sendToApi?.length) return;

      try {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ItemList: sendToApi.map(i => ({
              ItemID: i.ItemID,
              ItemQuanity: i.ItemQuanity
            }))
          })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        setApiRD(data);

      } catch (error) {
        console.error("API failed:", error);
      }
    }

    loadAPI();
  }, [sendToApi]);

  return (
    <div>
      {apiResponseData?.recipes?.map((recipe, i) => (
        <div
          key={i}
          style={{
            margin: "20px",
            padding: "10px",
            border: "1px solid #ccc"
          }}
        >
          <h3>Recipe ID: {recipe.recipe.recipeid}</h3>
          <p>Type: {recipe.recipe.recipetype}</p>

          <h4>Ingredients:</h4>
          <ul>
            {recipe.ingredients.map((ing, j) => (
              <li key={j}>
                Item {ing.itemid} × {ing.itemquantity}
              </li>
            ))}
          </ul>
        </div>
      )) || "Loading..."}
      
      <h2>Raw Materials</h2>
      <pre>
        {apiResponseData?.itemlist
          ? JSON.stringify(apiResponseData.itemlist, null, 2)
          : ""}
      </pre>
    </div>
  );
}
