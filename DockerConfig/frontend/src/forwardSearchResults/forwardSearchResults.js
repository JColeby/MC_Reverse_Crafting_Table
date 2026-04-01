import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function ForwardSearchResults() {
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

    fetch("http://localhost:8000/forwardSearch/", {
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
      <h2>Forward Search Results</h2>

      {data?.recipes?.map((r, i) => (
        <RecipeCard key={i} recipe={r} getName={getName} />
        )) || "Loading..."}
      <div className="App-form">
      <h3>Raw Materials</h3>
      <ul>
        {data?.itemlist?.map((item, i) => (
          <li key={i}>
            {getName(item.itemid)} × {item.itemquantity}
          </li>
        )) || "Loading..."}
      </ul>
      </div>
    </div>
  );
}
