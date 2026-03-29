

const jsonobj = {
  "item1": 1,
  "item2": 2,
  "item3": 3,
  "minecraft:stone_sword":4
};

// TODO: Make a function that can take in up to 10 items

export function SearchPage() {
    return (
        <form className="App-form">
          <label htmlFor="itemIDs">Items</label>
          <label htmlFor="quantity">#</label><br></br>
          
          <select id="itemIDs" name="itemIDs">
            {Object.entries(jsonobj).map(([key, value]) => {
            // This function will take all the item ids and their names
            // and make a human readable dropdown for users to use

            // Remove "minecraft:" prefix
            const rawName = key.split('minecraft:')[1] || key;
            
            // Converts name to be human readable"
            const readableName = rawName
              .split('_')                   
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');                    
            
            return (
              <option key={key} value={value}>{readableName}</option>
            );
          })}

          </select>

          <input className="App-quantity" type="number" id="quantity" name="quantity"></input><br></br>
          <input type="submit" value="Add item" name="addItem"></input>
          <input type="submit" value="Find raw materials" name="reverseSearch"></input>
          <input type="submit" value="What can I craft?" name="forwardSearch"></input>
        </form>
    )
}