import React from 'react'
import { Card, Spinner, Container } from 'react-bootstrap'

function LoadingComp() {
  return (
    <Container>
        <div className="loading-comp">
      <Card style={{width: "300px", height: "200px"}}>
        <Card.Body className="text-center">
            <h3 className='loading-text'>Loading...</h3>
            <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>

        </div>

    </Container>

  )
}

export default LoadingComp
