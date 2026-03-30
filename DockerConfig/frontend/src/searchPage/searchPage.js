import { useState } from "react";

export function SearchPage({ craftIDs }) {
  const [requestedItems, setRequestedItems] = useState([]);
  const [largeLoad, setLargeLoad] = useState("");
  const [itemID, setItemID] = useState(0);
  const [quantity, setQuantity] = useState(0);

  function handleAdd() {
    if (requestedItems.length >= 10) {
      setLargeLoad("Only 10 items may be requested");
      return;
    }

    // Find name from craftIDs using selected ID
    const selectedName = Object.entries(craftIDs).find(
      ([key, value]) => value === Number(itemID)
    )?.[0]?.split("minecraft:")[1] || "Unknown";

    // Make name human readable
    const readableName = selectedName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setLargeLoad("");
    setRequestedItems((prev) => [
      ...prev,
      {
        itemid: Number(itemID),              
        itemname: readableName,      
        ingredientquantity: Number(quantity),
      },
    ]);

    // Reset form
    setItemID("");
    setQuantity("");
  }

  function handleCraft(e) {
    e.preventDefault();
    // Send to API or navigate with requestedItems
    console.log("Crafting with:", requestedItems);
    // Example API data format:
    // const apiData = requestedItems.map(({ itemid, ingredientquantity }) => ({
    //   itemid,
    //   ingredientquantity,
    // }));
    // navigate("/fsr", { state: { requestedItems } });
  }

  function handleReverseSearch(e) {
    e.preventDefault();
    console.log("Reverse search with:", requestedItems);
  }

  return (
    <form className="App-form">

      <div className="form-labels">
      <label htmlFor="itemIDs" >Items</label>
      <label htmlFor="quantity">#</label>
      </div>

      <div className="form-inputs-row">
      <select id="itemIDs" name="itemIDs" value={itemID}
        onChange={(e) => setItemID(e.target.value)}>

        <option value="">Select an item</option>
        {Object.entries(craftIDs).map(([key, value]) => { // Makes dropdown that is human readable
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
        className="App-quantity" type="number" id="quantity" name="quantity" value={quantity}
        onChange={(e) => setQuantity(e.target.value)} min="1"
      />
      </div>
      <br />

      <button type="button" onClick={handleAdd}> Add item </button>

      <button type="submit" onClick={handleCraft}> What can I craft? </button>

      <button type="submit" onClick={handleReverseSearch}> Find raw materials </button>

      <p>
        {largeLoad && <strong>{largeLoad}</strong>}
        <br />
        Requested Items ({requestedItems.length}/10):
        <br />
        {requestedItems.map((item, index) => (
          <div key={index}>
            Item: {item.itemname} Quantity: {item.ingredientquantity}
          </div>
        ))}
      </p>
    </form>
  );
}