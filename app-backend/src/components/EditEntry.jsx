import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Card, Row, Col, ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ModalMessage from "./ModalMessage";
import FlashAlert from "./FlashAlert";
import localforage from "localforage";
import { useSelector, useDispatch } from "react-redux";
import { storeEntry } from '../Redux/entryReducer';
import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng,
} from "react-places-autocomplete";

function EditEntry({isLoaded}) {
    const navigate = useNavigate();
    const asyncValue = useRef();
    const { tripID } = useParams();
    const { entryID } = useParams();

    const [editSuccess, setEditSuccess] = useState(false);
    const [tokenError, setTokenError] = useState(false);
    // OLD PROPERTIES
    const [oldPhotoFiles, setOldPhotoFiles] = useState([]);
    const [oldEntryImages, setOldEntryImages] = useState([]);
    const [oldLocationsCollection, setOldLocationsCollection] = useState([]);

    const [postToken, setPostToken] = useState("");
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: null, lng: null})
    const [locationNames, setLocationNames] = useState([])

    // NEW PROPERTIES
    const [newtitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newphotoFiles, setNewPhotoFiles] = useState([]);
    const [newEntryImages, setNewEntryImages] = useState([]);
    const [newLocationsCollection, setNewLocationsCollection] = useState([]);
    const [newAddressCollection, setNewAddressCollection] = useState([]);
  
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
            previousEntry(data)
            splitLocationsArray(data)
          if (data.message === "Access Denied") {
            setTokenError(true)
            console.log("no token");
          } else {
            console.log(data)
          }
        });
    };
    
    // set state to load previous entry data in form
    const previousEntry = (data) => {
        console.log('previous entry fn fired')
        setNewTitle(data.title)
        setNewDate(data.date)
        setNewContent(data.content)
        console.log(data.photos, 'photodata ln 111')
        setOldEntryImages(data.photos)
    }

    // break up locations fetched locations array
    const splitLocationsArray = (data) => {
        let locNames = []
        for (let i = 0; i < data.locations.length; i++) {

        locNames.push(data.locations[i].name);
        
        console.log(locNames, 'locNames ln 76')
        }
        setLocationNames(locNames);
        setOldLocationsCollection(data.locations)

    }

    // new photo additions
    const _addPhotos = (e) => {
      const urlsArray = ["https://expertvagabond.com/wp-content/uploads/antarctica-sunset-landscape-900x600.jpg", "https://images.r.cruisecritic.com/slideshows/2019/AntarcticaCruising.jpg", 'https://expertvagabond.com/wp-content/uploads/antarctica-ice-arch-900x600.jpg',]


      const newArray = [...newphotoFiles, ...e.target.files];
      setNewPhotoFiles(newArray)
      console.log(newArray, "photos array updated");
      const filesAndUrls = newArray.map((file, index) => ({
        ...file,
        url: urlsArray[index], 
        fileName: file.name,
      }));
      const updatedArray = [...filesAndUrls];
      console.log(updatedArray, 'files and urls array');
      setNewEntryImages(updatedArray)
    };
  
    // removal for NEW added photos
    const _removePhoto = (index) => {
      const photoArr = [...newphotoFiles]
      console.log(index, 'index of clicked file');
  
      const selectedPhoto = photoArr.splice(index, 1)
      const newPhotosArr = photoArr.filter((photo) => photo !== selectedPhoto)
      console.log(newPhotosArr, 'photosArr after splice');
      
      const objectsArr = [...newEntryImages]
      const selectedImgObj = objectsArr.splice(index, 1);
      const newObjectsArr = objectsArr.filter((imgObj) => imgObj !== selectedImgObj)
      console.log(newObjectsArr, 'entry images after splice')
  
      setNewPhotoFiles([...newPhotosArr])
      setNewEntryImages([...newObjectsArr])
    };

    const _removeOldPhoto = (index) => {
        const photosArr = [...oldEntryImages]
        const selectedPhoto = photosArr.splice(index, 1)
        const newPhotosArr = photosArr.filter((photoObj) => photoObj !== selectedPhoto)
        console.log(newPhotosArr, 'mutated OLD photos array')

        setOldEntryImages([...newPhotosArr])
    }

    const _removeOldLocation = (index) => {
        const locNameArr = [...locationNames]
        const selectedLocName = locNameArr.splice(index, 1)
        const newLocNameArr = locNameArr.filter((locName) => locName !== selectedLocName)
        console.log(newLocNameArr, 'mutated locname arr')

        const locationsArr = [...oldLocationsCollection]
        const selectedLocation = locationsArr.splice(index, 1);
        const newLocationsArr = locationsArr.filter((location) => location !== selectedLocation)
        console.log(newLocationsArr, 'mutated full OLD locations array')

        setLocationNames([...newLocNameArr])
        setOldLocationsCollection([...newLocationsArr])
    }
    
    const _removeNewLocation = (index) => {
        const addressArr = [...newAddressCollection]
        const selectedAddress = addressArr.splice(index, 1)
        const newAddressArr = addressArr.filter((address) => address !== selectedAddress)
        console.log(newAddressArr, 'mutated address arr')

        const locationsArr = [...newLocationsCollection]
        const selectedLocation = locationsArr.splice(index, 1);
        const newLocationsArr = locationsArr.filter((location) => location !== selectedLocation)
        console.log(newLocationsArr, 'mutated full NEW locations array')

        setNewAddressCollection([...newAddressArr])
        setNewLocationsCollection([...newLocationsArr])
    }

    // new location additions
    const handleSelect = async (value) => {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0])
      setCoordinates(latLng);
      setAddress(value)
      console.log(coordinates);
      console.log(address);
      const location = address;
      const addressArr = [...newAddressCollection, location]
      setNewAddressCollection(addressArr) 
    //   [...addressArr]
      console.log(addressArr, 'addressArr before setState')
  
      const coordsAndLocName = { coords: latLng, name: value }
      const newLocationsArr = [...newLocationsCollection, coordsAndLocName]
      console.log(newLocationsArr, 'new locations array ln 110')
      setNewLocationsCollection(newLocationsArr)
  
    };
    
  
    const _handleSubmit = async (e) => {
      e.preventDefault();

      const mergedLocationsArr = [...oldLocationsCollection, ...newLocationsCollection]
      const mergedPhotosArr = [...oldEntryImages, ...newEntryImages]
      
      console.log(mergedLocationsArr, 'merged locations in submit')
      console.log(mergedPhotosArr, 'merged photos in submit')
  
      const updatedEntry = {
        date: newDate,
        title: newtitle,
        content: newContent,
        photos: mergedPhotosArr,
        locations: mergedLocationsArr,
      }
  
      const response = await fetch(`http://localhost:4000/entries/edit/${entryID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: postToken },
        body: JSON.stringify(updatedEntry)
      })
  
      const resEntry = await response.json();
      console.log(resEntry, 'create entry post response');

      if (resEntry.message === "entry updated") {
        setEditSuccess(true);
        setTimeout(() => {
          navigate(`/entries/${tripID}/entry/${entryID}`);
        }, 2000)
      } else {
        console.log('update not successful')
      }
  
    };
  
    if (tokenError) return <ModalMessage content="Your session has expired. Please login to continue..."/>
    if (!isLoaded) return <div>Loading...</div>;
    return (
      <Container className="bgImg">
        { editSuccess ? <FlashAlert content="Entry Successfully Updated" variant="warning" /> : null }
        <div id="editEntry">
        <h2><Badge bg="dark">Edit Entry</Badge></h2>
        <Card style={{ width: "50rem" }}>
          <Card.Body>
            <Form onSubmit={(e) => _handleSubmit(e)}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formEntryTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={newtitle}
                    type="text"
                    placeholder="Enter Entry Title (Optional)"
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    value={newDate}
                    type="date"
                    placeholder="Enter Entry Date"
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </Form.Group>
              </Row>
  
              <Form.Group className="mb-3" controlId="formContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  value={newContent}
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
                {oldEntryImages.length > 0 && (
                  <>
                    {oldEntryImages.map((entryImg, index) => 
                      <Badge bg="secondary" className="badges" key={index}>{entryImg.fileName}<span className="removePhotoBtn" onClick={() => _removeOldPhoto(index)}>X</span></Badge>
                    )}
                  </>
                )}
                {newphotoFiles.length > 0 && (
                  <>

                    {newphotoFiles.map((photoFile, index) => 
                      <Badge bg="secondary" className="badges" key={photoFile.name}>{photoFile.name}<span className="removePhotoBtn" onClick={() => _removePhoto(index)}>X</span></Badge>
                    )}
                  </>
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
                <div className="locations">
                    <div className="locationsHeader">Locations: </div>
                {locationNames.length > 0 && (
                    <>
                {locationNames.map((location, index) => 
                    <Badge bg="secondary" className="badges" key={index}>{location} <span onClick={() => _removeOldLocation(index)} className="removeLocNamesBtn">X</span></Badge>
                    )}
                    </>
                )}
                {newAddressCollection.length > 0 && (
                    <>
                {newAddressCollection.map((address, index) => 
                    <Badge bg="secondary" className="badges" key={index}>{address} <span className="removeLocNamesBtn" onClick={() => _removeNewLocation(index)}>X</span></Badge>
                    )}
                    </>
                )}
                </div>
              </Form.Group>
  
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
        </div>
      </Container>
    );
  }


export default EditEntry
