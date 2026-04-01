import { useLocation } from "react-router-dom";  
import { useState, useEffect } from "react";

function RecipeGrid({ pattern }) {
  const grid = pattern ? pattern.match(/.{1,3}/g) || [] : [];
  return (
    <div className="recipe-grid">
      {grid.map((row, i) => (
        <div key={i} className="grid-row">
          {row.split('').map((cell, j) => (
            <div key={j} className={`cell ${cell === '#' ? 'empty' : 'item'}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ForwardSearchResults() {
  const searchData = useLocation();
  const sendToApi = searchData.state?.apiData;
  const [apiResponseData, setApiRD] = useState();
  
  useEffect(() => {
    async function loadAPI() {
      if (!sendToApi?.length) return;
      
      try {
        const response = await fetch('http://localhost:8000/forwardSearch/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemlist: sendToApi })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        setApiRD(data);
      } catch (error) {
        console.error('API failed:', error);
      }
    }
    loadAPI();
  }, [sendToApi]);

  return (
    <div>
      {apiResponseData?.recipes?.map((recipe, i) => (
        <div key={i} className="recipe-card" style={{margin: '20px', padding: '10px', border: '1px solid #ccc'}}>
          <h3>Item {recipe.recipe.itemid}</h3>
          <RecipeGrid pattern={recipe.recipe.pattern} />
          <p>{recipe.recipe.recipetype}</p>
        </div>
      )) || 'Loading...'}
    </div>
  );
}