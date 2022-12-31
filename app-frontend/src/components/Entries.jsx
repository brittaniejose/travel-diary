import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";

function Entries({token}) {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const tripID = useSelector((state) => state.tripManager.tripID)

  useEffect(() => {
      const authToken = token === "" ? "" : `Bearer ${token}`;
      getEntries(authToken);
  }, []);

  

  // console.log(authToken, 'authtoken @ trips ln 16')

const getEntries = (token) => {
  fetch(`http://localhost:4000/trips/${tripID}/entries`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token },
  })
    .then((response) => response.json())
    .then((entries) => {
      if (entries.message === "Access Denied") {
        navigate('/');
        console.log('no token')
      } else {
        setEntries(entries)
      }
      });
};
console.log(entries, "entries array from fetch");

const goToCreate = () => {
    navigate('/entry/create')
  };

return (
  <div>
    <h1>Your Entries</h1>
    <div className="entries">
      {entries.map((entry) => (
        <div key={entry.id}>
          <div>
          {entry.name}
          </div>
          <div>
          {entry.date}
          </div>
          <LinkContainer to='/trips/entries/:entryID'>
          <button>See Entry</button>      
          </LinkContainer>
        </div>
      ))}
      <button onClick={(e) => goToCreate(e)}>Create Entry</button>
    </div>
  </div>
);
}

export default Entries
