import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { SearchPage } from './searchPage/searchPage';
import { ForwardSearchResults as FSR } from './forwardSearchResults/forwardSearchResults';
import { ReverseSearchResults as RSR } from './reverseSearchResults/reverseSearchResults';

const defaultJsonObj = {
  "basic object": 1,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [craftIDs, setCraftIDs] = useState(defaultJsonObj);

  useEffect(() => {
    const stored = Cookies.get('craftIDs');
    if (stored) {
      try {
        const parsed = setCraftIDs(JSON.parse(stored));
        setCraftIDs(parsed);
        return;
      } catch (e) {
        console.error('Invalid cookie data:', e);
      }
    } else {
        fetch(`${API_URL}/items`)
         .then(res => {
          if (!res.ok) throw new Error('Item fetch failed');
          return res.json();
          })
         .then((data) => {
        setCraftIDs(data);
        Cookies.set('craftIDs', JSON.stringify(data), { expires: 7 });
         })
         .catch(err => {
          console.error('items API failed, using default:', err);
         })
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
