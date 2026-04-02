import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchPage({ craftIDs }) {
  const [rows, setRows] = useState([{ itemID: "", quantity: "" }]);
  const [largeLoad, setLargeLoad] = useState("");
  const navigate = useNavigate();

  if (!craftIDs || typeof craftIDs !== "object") {
    return <div className="App-form">Loading items...</div>;
  }

  function handleAddRow() {
    if (rows.length >= 10) {
      setLargeLoad("Only 10 items may be requested");
      return;
    }
    setLargeLoad("");
    setRows((prev) => [...prev, { itemID: "", quantity: "" }]);
  }

  function handleRowChange(index, field, value) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function handleRemoveRow(index) {
    if (rows.length === 1) return; // always keep at least one row
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function buildApiData() {
    return rows
      .filter((row) => row.itemID !== "" && row.quantity !== "")
      .map((row) => ({
        itemid: Number(row.itemID),
        itemquantity: Number(row.quantity),
      }));
  }

  function handleCraft(e) {
    e.preventDefault();
    const apiData = buildApiData();
    if (apiData.length === 0) return;
    navigate("/fsr", { state: { apiData, craftIDs } });
  }

  function handleReverseSearch(e) {
    e.preventDefault();
    const apiData = buildApiData();
    if (apiData.length === 0) return;
    navigate("/rsr", { state: { apiData, craftIDs } });
  }

  return (
    <form className="App-form">

      <div className="form-labels">
        <label>Items</label>
        <label>#</label>
      </div>

      {rows.map((row, index) => (
        <div key={index} className="form-inputs-row">
          <select
            value={row.itemID}
            onChange={(e) => handleRowChange(index, "itemID", e.target.value)}
          >
            <option value="">Select an item</option>
            {Object.entries(craftIDs).map(([key, value]) => {
              const rawName = key.split("minecraft:")[1] || key;
              const readableName = rawName
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              return (
                <option key={key} value={value}>
                  {readableName}
                </option>
              );
            })}
          </select>

          <input
            className="App-quantity"
            type="number"
            value={row.quantity}
            onChange={(e) => handleRowChange(index, "quantity", e.target.value)}
            min="1"
          />

          {rows.length > 1 && (
            <button type="button" onClick={() => handleRemoveRow(index)}>
              ✕
            </button>
          )}
        </div>
      ))}

      <br />

      {largeLoad && <strong>{largeLoad}</strong>}

      <button type="button" onClick={handleAddRow}>
        Add item
      </button>

      <button type="submit" onClick={handleCraft}>
        What can I craft?
      </button>

      <button type="submit" onClick={handleReverseSearch}>
        Find raw materials
      </button>

    </form>
  );
}