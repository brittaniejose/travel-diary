import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Card, Row, Col, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import PlacesAutoComplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function CreateEntry({ isLoaded }) {
  const navigate = useNavigate();
  const asyncValue = useRef();
  const { tripID } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [entryImages, setEntryImages] = useState([]);
  const [locationsArray, setLocationsArray] = useState([]);
  const [addressCollection, setAddressCollection] = useState([]);
  const [postToken, setPostToken] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({lat: null, lng: null})

  useEffect(() => {
    setTimeout(() => {
      localforage.getItem("token").then(function (token) {
        asyncValue.current = token;
        if (asyncValue.current === null) {
          const authToken = "";
          console.log(authToken, "authToken empty str createentry comp ln 22");
          getCreatePage(authToken);
        } else {
          const authToken = asyncValue.current;
          const token = `Bearer ${authToken}`;
          setPostToken(token);
          getCreatePage(token);
        }
      });
    }, 1000);
  }, []);

  const getCreatePage = (token) => {
    fetch(`http://localhost:4000/entries/${tripID}/create`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Access Denied") {
          navigate("/");
          console.log("no token");
        } else {
          console.log("Access granted to this page");
        }
      });
  };

  const _addPhotos = (e) => {
    const newArray = [...photoFiles, ...e.target.files];
    setPhotoFiles(newArray)
    console.log(newArray, "photos array updated");
    // const filesAndUrls = newArray.map((file) => ({
    //   ...file,
    //   url: URL.createObjectURL(file),
    //   fileName: file.name,
    // }));
    // const updatedArray = [...filesAndUrls];
    // console.log(updatedArray, 'files and urls array');
    // setEntryImages(updatedArray)
  };

  const _removePhoto = (index) => {
    const photoArr = [...photoFiles]
    console.log(index, 'index of clicked file');

    const selectedPhoto = photoArr.splice(index, 1)
    const newPhotosArr = photoArr.filter((photo) => photo !== selectedPhoto )
    console.log(newPhotosArr, 'photosArr after splice');
    
    // const objectsArr = [...entryImages]
    // const selectedImgObj = objectsArr.splice(index, 1);
    // const newObjectsArr = objectsArr.filter((imgObj) => imgObj !== selectedImgObj)
    // console.log(newObjectsArr, 'entry images after splice')

    setPhotoFiles([...newPhotosArr])
    // setEntryImages([...newObjectsArr])
  };
  
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0])
    setCoordinates(latLng);
    setAddress(value)
    console.log(coordinates);
    console.log(address);
    const location = address;
    const addressArr = [...addressCollection, location]
    setAddressCollection([...addressArr])
    console.log(addressArr, 'addressArr before setState')

    const coordsAndLocName = { coords: latLng, name: value }
    const newLocationsArr = [...locationsArray, coordsAndLocName]
    console.log(newLocationsArr, 'new locations array ln 110')
    setLocationsArray(newLocationsArr)

  };
  

  const _handleSubmit = async (e) => {
    // post route including token here
    e.preventDefault();

    const newEntry = {
      date: date,
      title: title,
      content: content,
      photos: photoFiles,
      locations: locationsArray,
    }

    const response = await fetch(`http://localhost:4000/entries/${tripID}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: postToken },
      body: JSON.stringify(newEntry)
    })

    const resEntry = await response.json();
    console.log(resEntry, 'create entry post response')
    navigate(`/entries/${tripID}`);

  };

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <Container>
      <h2>Create Entry</h2>
      <Card>
        <Card.Body>
          <Form onSubmit={(e) => _handleSubmit(e)}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formEntryTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Entry Title (Optional)"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Entry Date"
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Write about your day here"
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add Photos</Form.Label>
              <Form.Control type="file" id='fileInput' accept="image/*" onChange={_addPhotos} multiple />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhotosList">
              {photoFiles.length > 0 && (
                <ul>
                  {photoFiles.map((photoFile, index) => 
                      <Badge bg="secondary" className="badges" key={photoFile.name}>{photoFile.name}<span className="removePhotoBtn" onClick={() => _removePhoto(index)}>X</span></Badge>
                  )}
                </ul>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Locations</Form.Label>
              <PlacesAutoComplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
                id="locInput">
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <p>Select a location</p>
                    <Form.Control
                      {...getInputProps({ placeholder: "Search a location", autoComplete: "on" })}
                    />
                    <ListGroup>
                      { loading ? <div>loading...</div> : null }
                      {suggestions.map((suggestion) => {
                        return <ListGroupItem
                        variant={ suggestion.active ? "primary" : "light" } 
                        key={suggestion.placeId}>{suggestion.description}</ListGroupItem>
                      })}
                    </ListGroup>
                  </div>
                )}
              </PlacesAutoComplete>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}



export default CreateEntry;
