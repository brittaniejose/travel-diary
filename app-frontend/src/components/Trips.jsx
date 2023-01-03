import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import localforage from "localforage";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [signupError, setSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [noTripsMsg, setNoTripsMsg] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const asyncValue = useRef();

  // set is pending with loading message then disable inside fetch
  useEffect(() => {
    setIsPending(true);
    setTimeout(() => { 
      localforage.getItem("token").then(function (token) {
        asyncValue.current = token;
        if (asyncValue.current === null) {
          const authToken = "";
          console.log(authToken, "authToken empty str trip comp ln 23");
          getTrips(authToken);
         } else {
           const authToken = asyncValue.current;
           console.log(authToken, "authToken trip comp ln 31");
           const token = `Bearer ${authToken}`;
           getTrips(token)
         }
       });
    }, 2000);

  }, []);



const getTrips = (token) => {
  fetch("http://localhost:4000/trips", {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
  })
    .then((response) => response.json())
    .then((trips) => {
      if (trips.message === "Access Denied") {
        setSignupError(true)
        setIsPending(false);
        setTimeout(() => {
          navigate('/');
        }, 2000)
        console.log('no token')
      } else if (trips.message === "Token Expired") {
        setLoginError(true)
        setIsPending(false);
        setTimeout(() => {
          navigate('/');
        }, 2000)
      } else {
        setTrips(trips);
        setIsPending(false);
        if (trips.length === 0) {
          setNoTripsMsg(true)
        } else {
          setNoTripsMsg(false)
        }
      }
      });
};
console.log(trips, "trips array");

const handleClick = (e, id) => {
	const tripID = id
	navigate(`/entries/${tripID}`)
}

const goToCreate = () => {
  navigate('/trips/create')
};

if (signupError) return <p>Please signup to continue...</p>
if (loginError) return  <p>Your session has expired. Please login to continue...</p>
return (
  <div>
    <h1>Your Trips</h1>
    { isPending ? <p>Loading...</p> : null }
    { noTripsMsg ? <p>You have no trips yet</p> : null }
    <div className="trips">
      {trips.map((trip) => (
        <div key={trip.id}>
          <div>
          {trip.name}
          </div>
          <div>
          {trip.startDate}
          </div>
          <div>
          {trip.endDate}
          </div>

          <button onClick={(e) => handleClick(e, trip.id)}>See Entries</button>      

        </div>
      ))}
      <button onClick={(e) => goToCreate(e)}>Create Trip</button>
    </div>
  </div>
);
}

export default Trips
