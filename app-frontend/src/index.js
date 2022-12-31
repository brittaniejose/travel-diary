import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavLayout from './components/NavLayout';
import Home from './components/Home';
import Trips from './components/Trips';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Entries from './components/Entries';
import CreateTrip from './components/CreateTrip';
import CreateEntry from './components/CreateEntry';
import { store } from './Redux/store';
import { Provider } from 'react-redux';
import localforage from "localforage";
import { useEffect, useState } from 'react';

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
     const getToken = async () => {
        const authToken = await localforage.getItem("token")
        if (authToken === null) {
          const jwt = ""
          console.log(jwt, 'jwt empty str app comp ln 29')
          setToken(jwt);
        } else {
          const jwt = authToken
          setToken(jwt);
        }
      }
      getToken()

    })


  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavLayout />}>
        <Route index element={<Home />}/>
        <Route path='/trips' element={<Trips token={token}/>} />
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/trips/:tripID/entries' element={<Entries token={token}/>} />
        <Route path='/trips/create' element={<CreateTrip token={token} />}/>
        <Route path='/entry/create' element={<CreateEntry token={token} />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>

);


