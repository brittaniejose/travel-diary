import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Fade } from 'react-bootstrap';

function FlashAlert({content, variant}) {
    const [open, setOpen] = useState(false);

    // setTimeout(() => {
    //     setOpen(!open)
    // }, 100)

  return (
    <Fade in={open}>
    <Alert variant={variant}>
      <p>
       {content}
      </p>
    </Alert>

    </Fade>

  );


}

export default FlashAlert