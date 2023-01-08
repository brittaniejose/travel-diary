import React, { useState } from "react";
import { Button, Form, Container, Card, Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/usersReducer";
import { useNavigate } from "react-router-dom";
import FlashAlert from "./FlashAlert";
import localforage from "localforage";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    const response = await fetch("http://localhost:4000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const resUser = await response.json();
    console.log(resUser, "user response @ signup form ln 25");

    if (resUser.message) {
      setEmailError(true);
    } else {
      const authenticatedUser = {
        email: email,
        password: resUser.user.password,
        token: resUser.token,
      }
      
      dispatch(saveUser(authenticatedUser));
      setIsPending(true);
      const token = resUser.token;
      storeToken(token);
      console.log(`${resUser.user.firstName} has signed up`)
      setSignUpSuccess(true)
      setTimeout(() => {
        navigate("/");
      }, 2000);
    };
  };

// store token in local forage so its not lost on each rerender
  const storeToken = async (token) => {
    // console.log(token, 'signup token ln 54')
    await localforage.setItem("token", token)
  };

  return (
    <Container className="bgImg">
      {signUpSuccess ? <FlashAlert content="Thanks for joining!" variant="success" /> : null}
      <div id="signUp">
      <h1><Badge bg="primary">Sign Up</Badge></h1>
      {isPending ? <p>Redirecting you to homepage</p> : null}
      <Card style={{ width: "60rem" }}>
        <Card.Body>
      <Form>
        <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="eg: Luke"
          onChange={(e) => setFirstName(e.target.value)}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="eg: Skywalker"
          onChange={(e) => setLastName(e.target.value)}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="eg: me@google.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        { emailError ? <p>This email is already registered</p> : null }
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your Password Here"
          onChange={(e) => setPassword(e.target.value)}
        />
        </Form.Group>
        <Button variant="primary" type="button" onClick={(e) => handleSubmit(e)}>
          Sign Up
        </Button>
      </Form>
      </Card.Body>
      </Card>
      </div>
    </Container>
  );
}

export default Signup;
