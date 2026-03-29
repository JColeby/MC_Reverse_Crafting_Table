import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { SearchPage } from './searchPage/searchPage';
import { ForwardSearchResults as FSR } from './forwardSearchResults/forwardSearchResults';
import { ReverseSearchResults as RSR } from './reverseSearchResults/reverseSearchResults';

const defaultJsonObj = {
  "minecraft:crafting_table": 1,
  "minecraft:stone_pickaxe": 2,
  "minecraft:iron_helmet": 3,
  "minecraft:stone_sword": 4
};

function App() {
  const [craftIDs, setCraftIDs] = useState({});

  useEffect(() => {
    const stored = Cookies.get('craftIDs');
    if (stored) {
      try {
        setCraftIDs(JSON.parse(stored));
      } catch (e) {
        console.error('Invalid cookie data:', e);
        setCraftIDs(defaultJsonObj);
        Cookies.set('craftIDs', JSON.stringify(defaultJsonObj), { expires: 7 });
      }
    } else {
      Cookies.set('craftIDs', JSON.stringify(defaultJsonObj), { expires: 7 });
      setCraftIDs(defaultJsonObj);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path='/' element={<SearchPage craftIDs={craftIDs} />} />
            <Route path='fsr' element={<FSR />} />
            <Route path='rsr' element={<RSR />} />
            <Route path='*' element={<SearchPage craftIDs={craftIDs} />} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
