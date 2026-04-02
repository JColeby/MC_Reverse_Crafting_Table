import { useNavigate } from "react-router-dom";

export function RecipeCard({ recipe, getName, craftIDs }) {
  const { recipe: r, ingredients } = recipe;
  const navigate = useNavigate();

  const keyToName = {};
  ingredients.forEach(ing => {
    if (ing.patternkey) keyToName[ing.patternkey] = getName(ing.itemid);
  });

  return (
    <div style={{ margin: 20, padding: 10, border: "1px solid #8b8b8b", 
    backgroundColor: "#c6c6c6", display:"flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

        <h3 style={{ margin: 0 }}>{getName(r.itemid)}</h3>
        <p style={{ margin: 0 }}>{r.recipetype}</p>

      </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        
        {r.pattern && (
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
          <li key={j}>{getName(ing.itemid)}</li>
        ))}
      </ul>
      
      <button onClick={() => r?.itemid != null && navigate("/fsr", { replace:true, state: { apiData: { itemid: r.itemid, itemquantity: 1  }, craftIDs} })}> Find raw materials </button>
    </div>
    </div>
  );
}
