import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else if (entries.message === "Token Expired") {
          setLoginError(true);
          setIsPending(false);
          setTimeout(() => {
            navigate("/");
          }, 2000);
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
  
  if (signupError) return <p>Please signup to continue...</p>
  if (loginError) return  <p>Your session has expired. Please login to continue...</p>
  return (
    <div>
      <h1>Your Entries</h1>
      { isPending ? <p>Loading...</p> : null }
      { noEntriesMsg ? <p>You have no entries yet</p> : null }
      <div className="entries">
        {entries.map((entry) => (
          <div key={entry.id}>
            <div>{entry.title}</div>
            <div>{entry.date}</div>
            <button onClick={() => goToEntry(entry.id)}>See Entry</button>
          </div>
        ))}
        <button onClick={goToCreate}>Create Entry</button>
      </div>
    </div>
  );
}

export default Entries;
