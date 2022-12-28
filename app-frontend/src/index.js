import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavLayout from './components/NavLayout';
import Home from './components/Home';
import Trips from './components/Trips';
import TripOverview from './components/TripOverview';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavLayout />}>
        <Route index element={<Home />}/>
        <Route path='/trips' element={<Trips />} />
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/profile' element={<Profile />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);


