import React, { useEffect, useState, useRef } from "react";
import ModalMessage from "./ModalMessage";
import FlashAlert from "./FlashAlert";
import { Button, Container, Badge, ListGroup, ListGroupItem, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import localforage from "localforage";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [signupError, setSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [noTripsMsg, setNoTripsMsg] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [postToken, setPostToken] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);
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
          getTrips(authToken);
         } else {
           const authToken = asyncValue.current;
           const token = `Bearer ${authToken}`;
          //  console.log(token, 'token ln 26 trips comp')
           getTrips(token)
           setPostToken(token);
         }
       });
    }, 1000);

  }, []);



const getTrips = (token) => {
  console.log(token, "token trips comp ln 39")
  fetch("http://localhost:4000/trips", {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
  })
    .then((response) => response.json())
    .then((trips) => {
      if (trips.message === "Access Denied") {
        setSignupError(true)
        setIsPending(false);
        console.log('no token')
      } else if (trips.message === "Token Expired") {
        setLoginError(true)
        setIsPending(false);
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

const handleClick = (id) => {
	const tripID = id
	navigate(`/entries/${tripID}`)
}

const handleDelete = (id) => {
  const tripID = id
  console.log(tripID, 'TRIP ID ln 79')
  fetch(`http://localhost:4000/trips/delete/${tripID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: postToken },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "trip deleted") {
        setDeleteSuccess(true);
        setDeleteFailure(false);
        setTimeout(() => {
          navigate(`/`);
        }, 2000);
      } else {
        setDeleteFailure(true);
      }
    });
}

const goToCreate = () => {
  navigate('/trips/create')
};

if (signupError) return <ModalMessage content="Please signup to continue..."/>;
if (loginError)
  return <ModalMessage content="Your session has expired. Please login to continue..."/>;
return (
  <Container className="bgImg">
    { deleteSuccess ? <FlashAlert content="Trip deleted" variant="danger" /> : null }
    <div className="listPages">
    <h1 className="listPageHeader"><Badge bg="dark">Your Trips</Badge></h1>
    { isPending ? <Spinner animation="border" variant="light" /> : null }
    { noTripsMsg ? <Card style={{width: "50%"}}><Card.Body>You have no trips yet</Card.Body></Card> : null }
    <div className="trips">
      {trips.map((trip) => (
        <ListGroup key={trip.id} >
          <ListGroupItem className="listGroups" style={{ width: '60rem' }}>
          <h4>
          {trip.name}
          </h4>
          <h4>
            <span className="labels">Start Date:</span>
          {trip.startDate}
          </h4>
          <h4>
          <span className="labels">End Date:</span>
          {trip.endDate}
          </h4>
          <Button onClick={() => handleClick(trip.id)} variant="primary">See Entries</Button>
          <Button onClick={() => handleDelete(trip.id)} variant="danger">Delete Trip</Button>      
          </ListGroupItem>
        </ListGroup>
      ))}
      <h2><Badge onClick={goToCreate} bg="success">Create Trip</Badge></h2>
      
    </div>
    </div>
  </Container>
);
}

export default Trips
