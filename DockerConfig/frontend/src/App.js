import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <form className="App-form">
          <label for="itemIDs">Items</label>
          <label for="quantity">#</label><br></br>
          <select id="itemIDs" name="itemIDs">
            <option>Stone Sword</option>
          </select>
          <input className="App-quantity" type="number" id="quantity" name="quantity"></input><br></br>
          <input type="submit" value="Add item" name="addItem"></input>
          <input type="submit" value="Find raw materials" name="reverseSearch"></input>
          <input type="submit" value="What can I craft?" name="forwardSearch"></input>
        </form>
      </header>
    </div>
  );
}

export default App;