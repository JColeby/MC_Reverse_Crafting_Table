import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeCard } from "../commonFunctions/commonFunctions";

export function ForwardSearchResults() {
  const location = useLocation();
  const { state } = location;
  const sendToApi = state?.apiData;
  const craftIDs = state?.craftIDs;
  const navigate = useNavigate();

  const [data, setData] = useState();
  
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

    setData(undefined);

    fetch("http://localhost:8000/forwardSearch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemlist: sendToApi })
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [location, sendToApi]);

  return (
    <div>
      <h2 className="App-form">Forward Search Results</h2>
      <button onClick={() => navigate('/searchPage')}>Make a new search</button>
      {data?.recipes?.map((r, i) => (
        <RecipeCard key={i} recipe={r} getName={getName} craftIDs={craftIDs} />
        )) || "Loading..."}
    </div>
  );
}
