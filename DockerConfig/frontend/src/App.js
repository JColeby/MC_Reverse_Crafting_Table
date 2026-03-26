import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchPage } from './searchPage/searchPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
        <Routes>
          <Route path='/' element={<SearchPage />} ></Route>
          <Route path='*' element={<SearchPage />} ></Route>
        </Routes>
        </header>
      </div>


    </BrowserRouter>
  );
  
}

export default App;