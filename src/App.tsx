import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import RegForm from './components/RegForm';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './Layout.tsx/Navbar';
import Artists from './components/Artists';
import BookConcerts from './components/BookConcerts';
import Purchase from './components/Purchase';
import PurchaseHis from './components/PurchaseHis';
import Fav from './components/Fav';

const App : React.FC = ()=> {
  return(
    <BrowserRouter>
    
    <Routes>
      <Route path='navbar' element={<Navbar/>}>
      <Route path='/' element={<RegForm/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Home/>} />
      <Route path='/artists' element={<Artists/>} />
      <Route path='/book-concerts' element={<BookConcerts/>} />
      <Route path='/purchase/:id' element={<Purchase/>} />
      <Route path='/purchase-history' element={<PurchaseHis/>} />
      <Route path='/fav' element={<Fav/>} />
    
      </Route>
    </Routes>
    </BrowserRouter>
  )
  
}

export default App;
