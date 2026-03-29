



// TODO: Make handleAdd output information on what the user has queried

import { useState } from "react";

export function SearchPage({ craftIDs }) {
    const [requestedItems, setRequestedItems] = useState([]);
    const [count, setCount] = useState(0);
    const [largeLoad, setLargeLoad] = useState('');

    function handleAdd(id, qunatity) {
      if (count >= 10) {
        requestedItems.push({
          itemid: id,
          ingredientquantity: qunatity,
        });
      }
      else {
        setLargeLoad('Only 10 items may be requested')
      };
      <p>
        { largeLoad } <br></br>
        { requestedItems.map }
      </p>
    }

    return (
        <form className="App-form">
          <label htmlFor="itemIDs">Items</label>
          <label htmlFor="quantity">#</label><br></br>
          
          <select id="itemIDs" name="itemIDs">
            {Object.entries(craftIDs).map(([key, value]) => {
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

          <input className="App-quantity" type="number" max="10" id="quantity" name="quantity"></input><br></br>
          <input type="submit" value="Add item" name="addItem"></input>
          <input type="submit" value="Find raw materials" name="reverseSearch"></input>
          <input type="submit" value="What can I craft?" name="forwardSearch"></input>
        </form>
    )
}