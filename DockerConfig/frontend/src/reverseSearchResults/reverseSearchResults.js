import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeCard } from "../commonFunctions/commonFunctions";

const cardStyle = {
  margin: "20px auto",
  padding: 10,
  border: "1px solid #8b8b8b",
  backgroundColor: "#c6c6c6",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 600,
};

export function ReverseSearchResults() {
  const location = useLocation();
  const { state } = location;
  const sendToApi = state?.apiData;
  const craftIDs = state?.craftIDs;
  const navigate = useNavigate();

  const [data, setData] = useState();

  // combine name lookup + formatting into one function
  function getName(id) {
    const selectedName = Object.entries(craftIDs).find(
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
    if (!Array.isArray(sendToApi) || sendToApi.length === 0) return;

    fetch("http://localhost:8000/reverseSearch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemlist: sendToApi })
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [sendToApi, location]);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h2 className="App-form">Reverse Search Results</h2>
      <button onClick={() => navigate('/searchPage')}>Make a new search</button>
      <h3 className="App-form">Raw Materials</h3>
      {data?.recipes?.map((r, i) => (
        <div key={i} style={ cardStyle }>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3 style={{ margin: 0 }}>{getName(r.recipe.itemid)}</h3>
            <p style={{ margin: 0 }}>{r.recipe.recipetype}</p>
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
            {r.ingredients.map((ing, j) => (
              <li key={j}>
                {getName(ing.itemid)} × {ing.itemquantity}
              </li>
            ))}
          </ul>
        </div>
      )) || "Loading..."}
      <div>
      <h3 className="App-form">Recipes</h3>
      <ul>
        {data?.recipes?.map((r, i) => (
            <RecipeCard key={i} recipe={r} getName={getName} craftIDs={craftIDs}/>
        )) || "Loading..."}
      </ul>
      </div>
    </div>
  );
}
