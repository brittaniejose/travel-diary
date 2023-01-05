import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import NavLayout from "./components/NavLayout";
import Home from "./components/Home";
// import Trips from "./components/Trips";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Entries from "./components/Entries";
import CreateTrip from "./components/CreateTrip";
import CreateEntry from "./components/CreateEntry";
import Entry from "./components/Entry";
import EditEntry from "./components/EditEntry";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import { useLoadScript } from "@react-google-maps/api";

const Trips = lazy(() => import("./components/Trips"));
const libraries = ["places"]

export default function App() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDlHRPWLON6plruqrryhZbJoUHFZcJEc-w", libraries: libraries,
  })
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route index element={<Home />} />
          <Route path="/trips" element={<Trips />} />   
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/entries/:tripID" element={<Entries />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/entries/:tripID/create" element={<CreateEntry isLoaded={isLoaded}/>} />
          <Route path="/entries/:tripID/entry/:entryID" element={<Entry isLoaded={isLoaded}/>}/>
          <Route path="/edit/:entryID" element={<EditEntry isLoaded={isLoaded}/>} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

