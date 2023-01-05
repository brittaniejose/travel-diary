import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Card, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import { useSelector, useDispatch } from "react-redux";
import { storeEntry } from '../Redux/entryReducer';
import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng,
} from "react-places-autocomplete";

function EditEntry() {
    const navigate = useNavigate();
    const asyncValue = useRef();
    const { tripID } = useParams();
    const { entryID } = useParams();
    const entry = useSelector((state) => state.entryManager.entry)
    const dispatch = useDispatch();

    // OLD PROPERTIES
    // const [title, setTitle] = useState("");
    // const [date, setDate] = useState("");
    // const [content, setContent] = useState("");
    // const [photoFiles, setPhotoFiles] = useState([]);
    // const [entryImages, setEntryImages] = useState([]);
    // const [locationsCollection, setLocationsCollection] = useState([]);
    const [addressCollection, setAddressCollection] = useState([]);

    const [postToken, setPostToken] = useState("");
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: null, lng: null})

    // NEW PROPERTIES
    const [newtitle, setNewTitle] = useState("");
    const [newdate, setNewDate] = useState("");
    const [newcontent, setNewContent] = useState("");
    const [newphotoFiles, setNewPhotoFiles] = useState([]);
    const [newEntryImages, setNewEntryImages] = useState([]);
    const [newLocationsCollection, setNewLocationsCollection] = useState([]);
    // const [newaddressCollection, setNewAddressCollection] = useState([]);
  
    useEffect(() => {
      setTimeout(() => {
        localforage.getItem("token").then(function (token) {
          asyncValue.current = token;
          if (asyncValue.current === null) {
            const authToken = "";
            console.log(authToken, "authToken empty str createentry comp ln 22");
            getEditPage(authToken);
          } else {
            const authToken = asyncValue.current;
            const token = `Bearer ${authToken}`;
            setPostToken(token);
            getEditPage(token);
          }
        });
      }, 1000);
    }, []);
  
    const getEditPage = (token) => {
      fetch(`http://localhost:4000/entries/edit/${entryID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Access Denied") {
            navigate("/");
            console.log("no token");
          } else {
            console.log(data)
            dispatch((storeEntry()))
          }
        });
    };
  
    const _addPhotos = (e) => {
      const newArray = [...newphotoFiles, ...e.target.files];
      setNewPhotoFiles(newArray)
      console.log(newArray, "photos array updated");
      const filesAndUrls = newArray.map((file) => ({
        ...file,
        url: URL.createObjectURL(file),
        fileName: file.name,
      }));
      const updatedArray = [...filesAndUrls];
      console.log(updatedArray, 'files and urls array');
      setNewEntryImages(updatedArray)
    };
  
    const _removePhoto = (index) => {
      const photoArr = [...newphotoFiles]
      console.log(index, 'index of clicked file');
  
      const selectedPhoto = photoArr.splice(index, 1)
      const newPhotosArr = photoArr.filter((photo) => photo !== selectedPhoto )
      console.log(newPhotosArr, 'photosArr after splice');
      
      const objectsArr = [...newEntryImages]
      const selectedImgObj = objectsArr.splice(index, 1);
      const newObjectsArr = objectsArr.filter((imgObj) => imgObj !== selectedImgObj)
      console.log(newObjectsArr, 'entry images after splice')
  
      setNewPhotoFiles([...newPhotosArr])
      setNewEntryImages([...newObjectsArr])
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
      setAddressCollection(addressArr) 
    //   [...addressArr]
      console.log(addressArr, 'addressArr before setState')
  
      const coordsAndLocName = { coords: latLng, name: value }
      const newLocationsArr = [...newLocationsCollection, coordsAndLocName]
      console.log(newLocationsArr, 'new locations array ln 110')
      setNewLocationsCollection(newLocationsArr)
  
    };
    
  
    const _handleSubmit = async (e) => {
      // post route including token here
      e.preventDefault();
  
      const updatedEntry = {
        date: newdate,
        title: newtitle,
        content: newcontent,
        photos: newEntryImages,
        locations: newLocationsCollection,
      }
  
      const response = await fetch(`http://localhost:4000/entries/edit/${entryID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: postToken },
        body: JSON.stringify(updatedEntry)
      })
  
      const resEntry = await response.json();
      console.log(resEntry, 'create entry post response')
      navigate(`/entries/${tripID}/entry/${entryID}`);
  
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
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter Entry Date"
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </Form.Group>
              </Row>
  
              <Form.Group className="mb-3" controlId="formContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Write about your day here"
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Add Photos</Form.Label>
                <Form.Control type="file" id='fileInput' onChange={_addPhotos} multiple />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPhotosList">
                {newphotoFiles.length > 0 && (
                  <ul>
                    {newphotoFiles.map((photoFile, index) => 
                      <li key={photoFile.name}>{photoFile.name}<span className="removePhotoBtn" onClick={() => _removePhoto(index)}>X</span></li>
                    )}
                  </ul>
                )}
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Select a location</Form.Label>
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
                <p>Current Locations</p>
                <p>New Locations</p>
                <Button type="button" variant="success" id="add-loc">
                  Add Location
                </Button>
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


export default EditEntry
