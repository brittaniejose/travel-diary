import React from 'react'
import { Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const seeTrips = () => {
    navigate('/trips');
  }

  const createTrips = () => {
    navigate('/trips/create')
  }

  return (
    <div className="bgImg">
      <Card style={{ width: '50rem' }} className="text-center home-card" >
        <Card.Header variant="dark">
        <h2>My Travel Diary</h2>
        </Card.Header>
        <Card.Body>
          <Card.Title>
      Keep track of your best travel memories with My Travel Diary. Log trips, create entries, and view all of your visited locations on a map!
      </Card.Title>
      </Card.Body>
      <Card.Footer className='cardBtns'>
      <Button variant="primary" id="seeTripsBtn" onClick={seeTrips}>See Trips</Button>
      <Button variant="success" onClick={createTrips}>Create Trips</Button>
      </Card.Footer>
      
      </Card>
    </div>
  )
}

export default Home