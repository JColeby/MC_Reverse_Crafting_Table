


export function SearchPage() {
    return (
        <form className="App-form">
          <label htmlFor="itemIDs">Items</label>
          <label htmlFor="quantity">#</label><br></br>
          <select id="itemIDs" name="itemIDs">
            <option>Stone Sword</option>
          </select>
          <input className="App-quantity" type="number" id="quantity" name="quantity"></input><br></br>
          <input type="submit" value="Add item" name="addItem"></input>
          <input type="submit" value="Find raw materials" name="reverseSearch"></input>
          <input type="submit" value="What can I craft?" name="forwardSearch"></input>
        </form>
    )
}