import React, { useState } from "react";
import { Button, Form, Container, Card, Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/usersReducer";
import { useNavigate } from "react-router-dom";
import FlashAlert from "./FlashAlert";
import localforage from "localforage";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingUser = {
      email: email,
      password: password,
    };

    const response = await fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingUser),
    });

    const resUser = await response.json();
    console.log(resUser, "user response @ login form ln 22");

    if (resUser.message === "This email is not registered") {
      setEmailError(true);
    } else if (resUser.message === "Password is incorrect") {
      setPasswordError(true);
      setEmailError(false);
    } else {
      setLoginSuccess(true);
      const authenticatedUser = {
        email: email,
        password: resUser.user.password,
        token: resUser.token,
      };
      dispatch(saveUser(authenticatedUser));
      const token = authenticatedUser.token;
      storeToken(token);
      console.log(`${resUser.user.firstName} has logged in `);
      if (resUser.message === "Login Successful") {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  };

  // store token in local forage so its not lost on each rerender
  const storeToken = async (token) => {
    // console.log(token, 'login token ln 55')
    await localforage.setItem("token", token);
  };

  return (
    <Container className="bgImg">
      { loginSuccess ? <FlashAlert content="Login Successful" variant="success" /> : null}
      <div id="login">
        <h1>
          <Badge bg="success">Login</Badge>
        </h1>
        {isPending ? <p>Redirecting you to homepage</p> : null}
        <Card style={{ width: "50rem" }}>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="eg: me@google.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError ? <p>This email is not registered</p> : null}
              </Form.Group>

              <Form.Group className="passInput">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your Password Here"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError ? <p>Password is incorrect</p> : null}
              </Form.Group>
              <Button
                variant="success"
                type="submit"
                onClick={(e) => handleSubmit(e)}>
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
