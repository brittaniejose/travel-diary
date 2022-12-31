import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { saveUser } from '../Redux/usersReducer';
import { useNavigate } from 'react-router-dom';
import localforage from "localforage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


async function handleSubmit(e) {
  e.preventDefault();

  const existingUser = {
    email: email,
    password: password
  }

  const response = await fetch('http://localhost:4000/users/login', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(existingUser)
  });
  
  const resUser = await response.json()
  console.log(resUser, "user response @ login form ln 22");
  
  if (resUser.message === "This email is not registered") {
    setEmailError(true);
  } else if (resUser.message === 'Password is incorrect'){
    setPasswordError(true);
    setEmailError(false);
  } else {
    setIsPending(true);
    const authenticatedUser = {
      email: email,
      password: resUser.user.password,
      token: resUser.token
    }
    dispatch(saveUser(authenticatedUser));
    const token = authenticatedUser.token;
    storeToken(token);
    navigate('/');
  }
}

// store token in local forage so its not lost on each rerender
const storeToken = async (token) => {
  console.log(token, 'login token ln 55')
  await localforage.setItem("token", token)
}

  return (
    <div>
        <h1>Login</h1>
        { isPending ? <p>Redirecting you to homepage</p> : null }
      <form>
        <label>Email</label>
        <input type="text" placeholder='eg: me@google.com' onChange={(e) => setEmail(e.target.value)}/>
        { emailError ? <p>This email is not registered</p> : null }
        <label>Password</label>
        <input type="password" placeholder='Your Password Here' onChange={(e) => setPassword(e.target.value)}/>
        { passwordError ? <p>Password is incorrect</p> : null }
        <button type="submit" onClick={(e) => handleSubmit(e)}>Login</button>
      </form>
    </div>
  )
}

export default Login
