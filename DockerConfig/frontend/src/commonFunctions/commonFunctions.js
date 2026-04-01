function PatternGrid({ pattern, ingredients, getName }) {
  const keyToName = {};
  ingredients.forEach(ing => {
    if (ing.patternkey) keyToName[ing.patternkey] = getName(ing.itemid);
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 50px)", gap: 4 }}>
      {pattern.split("").map((char, i) => (
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
  );
}