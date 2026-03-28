import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchPage } from './searchPage/searchPage';
import { ForwardSearchResults as FSR } from './forwardSearchResults/forwardSearchResults';
import { ReverseSearchResults as RSR } from './reverseSearchResults/reverseSearchResults';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
        <Routes>
          <Route path='/' element={<SearchPage />} ></Route>
          <Route path='fsr' element={<FSR />}></Route>
          <Route path='rsr' element={<RSR />}></Route>
          <Route path='*' element={<SearchPage />} ></Route>
        </Routes>
        </header>
      </div>


    </BrowserRouter>
  );
  
}

export default App;