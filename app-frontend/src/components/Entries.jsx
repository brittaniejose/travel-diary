import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Badge, ListGroup, ListGroupItem, Card } from 'react-bootstrap';
import ModalMessage from "./ModalMessage";
import Spinner from 'react-bootstrap/Spinner';
import localforage from "localforage";

function Entries() {
  const [entries, setEntries] = useState([]);
  const [signupError, setSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [noEntriesMsg, setNoEntriesMsg] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const asyncValue = useRef();
  const { tripID } = useParams();

  useEffect(() => {
    setIsPending(true);
    setTimeout(() => {
      localforage.getItem("token").then(function (token) {
        asyncValue.current = token;
        if (asyncValue.current === null) {
          const authToken = "";
          getEntries(authToken);
        } else {
          const authToken = asyncValue.current;
          const token = `Bearer ${authToken}`;
          getEntries(token);
        }
      });
    }, 2000);
  }, []);

  const getEntries = (token) => {
    fetch(`http://localhost:4000/entries/${tripID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    })
      .then((response) => response.json())
      .then((entries) => {
        if (entries.message === "Access Denied") {
          console.log("no token");
          setSignupError(true);
          setIsPending(false);
        } else if (entries.message === "Token Expired") {
          setLoginError(true);
          setIsPending(false);
        } else {
          setEntries(entries);
          setIsPending(false);
          console.log(entries, "entries array from fetch");
          if (entries.length === 0) {
            setNoEntriesMsg(true);
          } else {
            setNoEntriesMsg(false);
          }
        }
      });
  };

  const goToEntry = (id) => {
    navigate(`/entries/${tripID}/entry/${id}`)
  }

  const goToCreate = () => {
    navigate(`/entries/${tripID}/create`);
  };
  
  if (signupError) return <ModalMessage content="Please signup to continue..."/>;
  if (loginError)
    return <ModalMessage content="Your session has expired. Please login to continue..."/>;
  return (
    <Container className="bgImg">
      <div className="listPages">
      <h1 className="listPageHeader"><Badge bg="dark">Your Entries</Badge></h1>
      { isPending ? <Spinner animation="border" variant="light" /> : null }
      { noEntriesMsg ? <Card style={{width: "50%"}}><Card.Body>You have no entries yet</Card.Body></Card> : null }
      <div className="entries">
        {entries.map((entry) => (
          <ListGroup key={entry.id}>
            <ListGroupItem className="listGroups" style={{ width: '60rem' }}>
            <h4>{entry.title}</h4>
            <h4><span className="labels">Date:</span>{entry.date}</h4>
            <Button onClick={() => goToEntry(entry.id)} variant="primary">See Entry</Button>
            </ListGroupItem>
          </ListGroup>
        ))}
        <h2><Badge onClick={goToCreate} bg="success">Create Entry</Badge></h2>
      </div>
      </div>
    </Container>
  );
}

export default Entries;
