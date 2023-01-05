import React, { useState, useEffect, useRef } from 'react'
import { Button, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import localforage from "localforage";

function CreateTrip() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [postToken, setPostToken] = useState("");
  const navigate = useNavigate();
  const asyncValue = useRef();

  useEffect(() => {
    setTimeout(() => { 
      localforage.getItem("token").then(function (token) {
        asyncValue.current = token;
        if (asyncValue.current === null) {
          const authToken = "";
          console.log(authToken, "authToken empty str createtrip comp ln 22");
          getCreatePage(authToken);
         } else {
           const authToken = asyncValue.current;
           console.log(authToken, "createtrip trip comp ln 26");
           const token = `Bearer ${authToken}`;
           setPostToken(token);
           getCreatePage(token)
         }
       });
    }, 1000);
  }, []);

  const getCreatePage = (token) => {
    fetch("http://localhost:4000/trips/create", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    })
      .then((response) => response.json())
      .then((createPage) => {
        if (createPage.message === "Access Denied") {
          navigate('/');
          console.log('no token')
        } else {
          console.log('Access granted to this page')
        }
        });
  };

  const _handleSubmit = async (e) => {
    e.preventDefault();

    const newTrip = {
      name: name,
      startDate: startDate,
      endDate: endDate
    }

    const response = await fetch("http://localhost:4000/trips/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: postToken },
      body: JSON.stringify(newTrip),
    });

    const resTrip = await response.json();
    console.log(resTrip, 'createTrip component post')

    navigate('/trips')

  }

  return (
    <Container>
      <h2>Create Trip</h2>
    <Card>
      <Card.Body>
    <Form onSubmit={(e) => _handleSubmit(e)}>
    <Form.Group className="mb-3" controlId="formTripName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Trip Name (Optional)" onChange={(e) => setName(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formStartDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" placeholder="Enter Start Date" onChange={(e) => setStartDate(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEndDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date" placeholder="Enter End Date" onChange={(e) => setEndDate(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </Card.Body>
    </Card>
    </Container>
  )
}


export default CreateTrip
