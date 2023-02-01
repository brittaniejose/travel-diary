import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalMessage from "./ModalMessage";
import FlashAlert from "./FlashAlert";
import LoadingComp from "./LoadingComp";
import localforage from "localforage";
import {
  Button,
  Container,
  Card,
  Row,
  Col,
  Badge,
  Carousel,
} from "react-bootstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
// import { storeEntry } from "../Redux/entryReducer";
// import { useDispatch } from 'react-redux';
import { useMemo } from "react";
import CardHeader from "react-bootstrap/esm/CardHeader";

function Entry({ isLoaded }) {
  // MESSAGE STATES
  const [signupError, setSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [noEntryMsg, setNoEntryMsg] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [yesPhotos, setYesPhotos] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);
  const [fetched, setFetched] = useState(false);
  // ITEM STATES
  const [entry, setEntry] = useState({});
  const [locationNames, setLocationNames] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [postToken, setPostToken] = useState("");
  const [trip, setTrip] = useState({});
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
        splitLocationsArray(data);
        // console.log(data, "data ln 55");
      });
  };

  const renderConditionals = (data) => {
    console.log("renderconditionals fired");
    if (data.message === "Access Denied") {
      console.log("no token");
      setSignupError(true);
      setIsPending(false);
    } else if (data.message === "Token Expired") {
      setLoginError(true);
      setIsPending(false);
      console.log('session expired')
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
  };

  const splitLocationsArray = (data) => {
    let locNames = [];
    let coords = [];

    for (let i = 0; i < data.locations.length; i++) {
      locNames.push(data.locations[i].name);
      coords.push(data.locations[i].coords);

      // console.log(locNames, "locNames ln 76");
      // console.log(coords, "coords ln 77");
    }
    setLocationNames(locNames);
    setCoordinates(coords);
  };

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
          setDeleteFailure(true);
        }
      });
  };

  const goToEditPage = () => {
    navigate(`/edit/${entryID}`);
  };

  console.log(coordinates, "coordinates to be passed as prop");
  if (isPending) return <LoadingComp />;
  if (signupError) return <ModalMessage content="Please signup to continue..."/>;
  if (loginError)
    return <ModalMessage content="Your session has expired. Please login to continue..."/>;
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <Container className="entryContainer">
      { deleteSuccess ? <FlashAlert content="Entry deleted" variant="danger" /> : null }
      <div>
        {noEntryMsg ? <p>No entry found</p> : null}
        <Row>
          <Col xs={8}>
            <Card className="entry">
              <CardHeader id="entryHeader">
                <h2>{entry.title}</h2>
                {/* <h3>Trip: {trip.name}</h3>
            <h4>{trip.startDate}-{trip.endDate}</h4> */}
                <h3>
                  <span className="labels">Date:</span>
                  {entry.date}
                </h3>
              </CardHeader>
              <Card.Body>
                <div>{entry.content}</div>
                <div className="entryBtns">
                  <Button
                    className="labels"
                    variant="danger"
                    onClick={deleteEntry}>
                    Delete Entry
                  </Button>
                  <Button variant="warning" onClick={goToEditPage}>
                    Edit Entry
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={4}>
            <Card>
              <CardHeader as="h3">Locations</CardHeader>
              <Card.Body>
                <ul>
                  {locationNames.map((locName, index) => (
                    <li key={index}>{locName}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="photos-map">
          <Col xs={7}>
            <Card style={{ width: "40rem" }} className="photoCard">
              <CardHeader>
                <h3>Photos</h3>
              </CardHeader>
              <Carousel style={{ width: "40rem" }}>
                {yesPhotos
                  ? entry.photos.map((photo, index) => (
                      <Carousel.Item>
                        <img
                          className="d-block w-100 photos"
                          key={index}
                          src={photo.url}
                          alt={photo.fileName}
                        />
                      </Carousel.Item>
                    ))
                  : null}
              </Carousel>
            </Card>
          </Col>

          <Col xs={4}>
            <Card
              style={{ width: "530px" }}
              className="text-center"
              id="mapCard">
              <CardHeader>
                <h3>Map</h3>
              </CardHeader>
              <Card.Body>
                Map is centered around first location entered. Use zoom to see
                other locations not in view.
                <Map coordinates={coordinates} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
function Map({ coordinates }) {
  // change center to show coordinate values dynamically
  const [mapCenter, setMapCenter] = useState({});
  const [mapCoords, setMapCoords] = useState([]);

  useEffect(() => {
    setMapCoords(coordinates);
    setMapCenter(coordinates[0]);
    console.log(mapCenter, "mapcenter");
    console.log(mapCoords, "mapcoords");
  }, [coordinates]);

  const markers = mapCoords.map((geoloc, index) => {
    console.log(geoloc, "geoloc prop map comp ln 227");
    console.log(mapCenter, "mapcenter ln 229");
    return (
      <Marker key={index} position={{ lat: geoloc.lat, lng: geoloc.lng }} />
    );
  });

  // // stops map from recentering itself on each re-render
  const center = useMemo(
    () => ({ lat: mapCenter?.lat, lng: mapCenter?.lng }),
    [mapCoords]
  );

  return (
    <div>
      {mapCoords && (
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container">
          {markers}
        </GoogleMap>
      )}
    </div>
  );
}

export default Entry;
