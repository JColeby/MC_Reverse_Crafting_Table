function RecipeCard({ recipe, getName }) {
  const { recipe: r, ingredients } = recipe;

  const keyToName = {};
  ingredients.forEach(ing => {
    if (ing.patternkey) keyToName[ing.patternkey] = getName(ing.itemid);
  });

  return (
    <div style={{ margin: 20, padding: 10, border: "1px solid #8b8b8b", backgroundColor: "#c6c6c6" }}>
      <h3>{getName(r.itemid)}</h3>
      <p>{r.recipetype}</p>

      {r.pattern && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)", gap: 4 }}>
          {r.pattern.split("").map((char, i) => (
            <div key={i} title={keyToName[char] || ""} style={{
              width: 50, height: 50,
              background: char === " " ? "#eee" : "#c8a96e",
              border: "1px solid #999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, textAlign: "center"
            }}>
              {char === " " ? "" : (keyToName[char] ?? char)}
            </div>
          ))}
        </div>
      )}

      <ul>
        {ingredients.map((ing, j) => (
          <li key={j}>{getName(ing.itemid)}</li>
        ))}
      </ul>
    </div>
  );
}