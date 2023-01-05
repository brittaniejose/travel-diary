import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { storeEntry } from "../Redux/entryReducer";
import { useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import { useMemo } from 'react';

function Entry({isLoaded}) {
  // MESSAGE STATES
  const [signupError, setSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [noEntryMsg, setNoEntryMsg] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [yesPhotos, setYesPhotos] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);
  const [fetched, setFetched] = useState(false)
  // ITEM STATES
  const [entry, setEntry] = useState({});
  const [locationNames, setLocationNames] = useState([]);
  const [coordinates, setCoordinates] = useState([])
  const [postToken, setPostToken] = useState("");
  const [trip, setTrip] = useState({})
  const { tripID, entryID } = useParams();
  const asyncValue = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    setIsPending(true);
    setTimeout(() => {
      localforage.getItem("token").then(function (token) {
        asyncValue.current = token;
        if (asyncValue.current === null) {
          const authToken = "";
          getEntry(authToken);
        } else {
          const authToken = asyncValue.current;
          const token = `Bearer ${authToken}`;
          getEntry(token);
          setPostToken(token);
        }
      });
    }, 1000);
  }, []);

  const getEntry = (token) => {
    fetch(`http://localhost:4000/entries/${tripID}/entry/${entryID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        renderConditionals(data);
        splitLocationsArray(data)
        console.log(data, 'data ln 55')
        // if (data.message === "Access Denied") {
        //   console.log("no token");
        //   setSignupError(true);
        //   setIsPending(false);

        //   setTimeout(() => {
        //     navigate("/");
        //   }, 2000);

        // } else if (data.message === "Token Expired") {
        //   setLoginError(true);
        //   setIsPending(false);

        //   setTimeout(() => {
        //     navigate("/");
        //   }, 2000);
          
        // } else {
        //   setIsPending(false);
        //   if (data.photos) {
        //     setYesPhotos(true);
        //   }
        //   // setTrip(data.trip)

        //   if (data.length === 0) {
        //     setNoEntryMsg(true);
        //   } else {
        //     setNoEntryMsg(false);
        //   }
          // console.log(data.entry.locations, "locations array ln 68")

          // save coordinates and location names in separate array states
          // let locNames = []
          // let coords = []

          // for (let i = 0; i < data.entry.locations.length; i++) {

          //   locNames.push(data.entry.locations[i].name);
          //   coords.push(data.entry.locations[i].coords);
            
          //   console.log(locNames, 'locNames ln 76')
          //   console.log(coords, 'coords ln 77')
          // }
          // setLocationNames(locNames);
          // setCoordinates(coords);


        }
      );
    };

    const renderConditionals = (data) => {
      console.log('renderconditionals fired')
      if (data.message === "Access Denied") {
        console.log("no token");
        setSignupError(true);
        setIsPending(false);
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
        
      }  else if (data.message === "Token Expired") {
        setLoginError(true);
        setIsPending(false);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setIsPending(false);
        if (data.photos) {
          setYesPhotos(true);
        }
        if (data.length === 0) {
          setNoEntryMsg(true);
        } else {
          setNoEntryMsg(false);
          setEntry(data);
        }
      }
    }
    
    const splitLocationsArray = (data) => {
      let locNames = []
      let coords = []

      for (let i = 0; i < data.locations.length; i++) {

        locNames.push(data.locations[i].name);
        coords.push(data.locations[i].coords);
        
        console.log(locNames, 'locNames ln 76')
        console.log(coords, 'coords ln 77')
      }
      setLocationNames(locNames);
      setCoordinates(coords);
    }

    const deleteEntry = () => {
      fetch(`http://localhost:4000/entries/delete/${entryID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: postToken },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "entry deleted") {
          setDeleteSuccess(true);
          setDeleteFailure(false);
          setTimeout(() => {
            navigate(`/entries/${tripID}`);
          }, 2000);
        } else {
          setDeleteFailure(true)
        }
      })
    }

    const goToEditPage = () => {
      navigate(`/edit/${entryID}`)
    }

    // console.log(coordinates, 'coordinates to be passed as prop')
  if (signupError) return <p>Please signup to continue...</p>
  if (loginError) return  <p>Your session has expired. Please login to continue...</p>
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      { isPending ? <p>Loading...</p> : null }
      { noEntryMsg ? <p>No entry found</p> : null }
      { deleteSuccess ? <p>Entry "{entry.title}" was successfully deleted.</p> : null }
      { deleteFailure ? <p>Failed to delete entry. Please try again later.</p> : null }
      {/* <Card style={{ width: '60rem', height: '60rem'  }} className="entry">
        <Card.Body> */}
            <h2>{entry.title}</h2>
            {/* <h3>Trip: {trip.name}</h3>
            <h4>{trip.startDate}-{trip.endDate}</h4> */}
            <div>{entry.date}</div>
            <div>{entry.content}</div>
            <div >
              {yesPhotos? entry.photos.map((photo, index) => 
              <img key={index} className="photos" src={photo.url} alt={photo.fileName}/>
              ) : null }
            </div>
            <div>
              <span>Locations</span>
              {locationNames.map((locName, index) => 
                <div key={index}>{locName}</div>
              )}
            </div>
          {/* </Card.Body>
      </Card> */}
      <p>Map is centered around first location entered. Use zoom to see other locations not in view.</p>
      <Map coordinates={coordinates} />
      <button onClick={deleteEntry}>Delete Entry</button>
      <button onClick={goToEditPage}>Edit Entry</button>
    </div>
  )
}
function Map({coordinates}) {
  // change center to show coordinate values dynamically
  const [mapCenter, setMapCenter] = useState({})
  const [mapCoords, setMapCoords] = useState([])

  useEffect(() => {
    setMapCoords(coordinates)
    setMapCenter(coordinates[0])
  }, [])
  
    console.log(mapCenter, 'mapcenter')
    console.log(mapCoords, 'mapcoords')
    console.log(coordinates, 'coordinates prop map comp')
  
  const markers = mapCoords.map((geoloc, index) => {
    return <Marker key={index} position={{lat: geoloc.lat, lng: geoloc.lng}}/>
  })

  // // stops map from recentering itself on each re-render
  const center = useMemo(() => ({lat: mapCenter.lat, lng: mapCenter.lng}), [])

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      {markers}
    </GoogleMap>
  )
}

{/* <Marker position={{lat: -61.9882, lng: -58.0196}} /> */}

export default Entry
