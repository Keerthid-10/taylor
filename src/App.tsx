import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import RegForm from './components/RegForm';
import Login from './components/Login';
import Home from './components/Home';

const App : React.FC = ()=> {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegForm/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Home/>} />
    </Routes>
    </BrowserRouter>
  )
  
}

export default App;
