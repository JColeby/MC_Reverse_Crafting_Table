import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { SearchPage } from './searchPage/searchPage';
import { ForwardSearchResults as FSR } from './forwardSearchResults/forwardSearchResults';
import { ReverseSearchResults as RSR } from './reverseSearchResults/reverseSearchResults';


// This is a default object that will be loaded if the API call isn't working
const defaultJsonObj = {
  "basic object": 1,
};

// The app for everything that the site does.
function App() {
  const [craftIDs, setCraftIDs] = useState(defaultJsonObj);
  
/*This effect checks if user has the craftIDs cookie stored.
  If there is not, the /items API will be called and will create
  the cookie to be used to load the craftIDs object that will be 
  passed around the pages. */
  useEffect(() => {
    const stored = Cookies.get('craftIDs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCraftIDs(parsed);
        return;
      } catch (e) {
        console.error('Invalid cookie data:', e);
      }
    } else {
        fetch(`http://localhost:8000/items`)
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
  /* This controls all the ways that a user can navigate the site.
     /fsr send them to the forwardSearchResults page
     /rsr send them to the reverseSearchResults page 
     Any other thing you input after the / will send you to the initial search page.  */
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
