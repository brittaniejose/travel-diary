import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/usersReducer";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [emailError, setEmailError] = useState(false);
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
      navigate("/");
    };
  };

// store token in local forage so its not lost on each rerender
  const storeToken = async (token) => {
    // console.log(token, 'signup token ln 54')
    await localforage.setItem("token", token)
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {isPending ? <p>Redirecting you to homepage</p> : null}
      <form>
        <label>First Name</label>
        <input
          type="text"
          placeholder="eg: Luke"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label>Last Name</label>
        <input
          type="text"
          placeholder="eg: Skywalker"
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="text"
          placeholder="eg: me@google.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        { emailError ? <p>This email is already registered</p> : null }
        <label>Password</label>
        <input
          type="password"
          placeholder="Your Password Here"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={(e) => handleSubmit(e)}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
