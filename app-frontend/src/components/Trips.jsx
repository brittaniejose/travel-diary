import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { saveTripID } from "../Redux/tripsReducer";
import { useDispatch } from "react-redux";

function Trips({token}) {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const authToken = token === "" ? "" : `Bearer ${token}`;
    getTrips(authToken);
  }, []);


const getTrips = (token) => {
  fetch("http://localhost:4000/trips", {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
  })
    .then((response) => response.json())
    .then((trips) => {
      if (trips.message === "Access Denied") {
        navigate('/');
        console.log('no token')
      } else {
        setTrips(trips)
        // trips.forEach(trip => {
        // dispatch(saveTrip(trip))
        // });
      }
      });
};
console.log(trips, "trips array from fetch");

const handleClick = (e, id) => {
	const tripID = id
	console.log(tripID)
	dispatch(saveTripID(tripID))

	navigate(`/trips/${tripID}/entries`)
}

const goToCreate = () => {
  navigate('/trips/create')
};

return (
  <div>
    <h1>Your Trips</h1>
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
