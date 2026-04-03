import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeCard } from "../commonFunctions/commonFunctions";

/* This is the function that will display all recipes that the items the user
   requested are used in. There is a return to search button and each recipe card
   will allow you to reverseSearch it to find the raw materials that you need to
   make that specific recipes\ */
export function ForwardSearchResults() {
  const location = useLocation();
  const { state } = location;
  const sendToApi = state?.apiData;
  const craftIDs = state?.craftIDs;
  const navigate = useNavigate();

  const [data, setData] = useState();
  
  // Grabs the name of the item and makes it human readable
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

  /* Checks if the API data is formatted correctly. If it
     is, then we send the data to the /forwardSearch/ API */
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
