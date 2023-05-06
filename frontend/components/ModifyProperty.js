import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Spinner, Table, InputGroup, Button, FormControl, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { addProperty, uploadImageToCloud, modifyProperty, getRoomTypes } from '../utils';
import { setToast } from '../actions/app-actions';
import { Country, State, City }  from 'country-state-city';
import { Typeahead } from 'react-bootstrap-typeahead';

function ModifyProperty({data, showFlag, fn, mode}) {
    const dispatch = useDispatch();
    const resetPropertyState = {
        hotel_name: '',
        image: '',
        description: '',
        hotelbaseprice: '',
        hotel_addr: '',
        summary: '',
        hotel_phone: '',
        city: ''
    };
    const [country, setCountry] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [allStates, setAllStates] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [roomSelection, setRoomSelection] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomCount, setRoomCount] = useState(0);
    const [propertyForm, setPropertyForm] = useState(resetPropertyState);

    useEffect(() => {
        // setCities(City.getCitiesOfState('US', 'CA'));
        setCities(City.getCitiesOfState('US', 'CA'));
        setStates(State.getStatesOfCountry('US'));
        setAllStates(State.getStatesOfCountry('US'));
        async function fetchData() {
            const roomTypes = await getRoomTypes();
            setRoomTypes(roomTypes);
        }
        fetchData();
        setRooms([]);
    }, [])

    useEffect(() => {
        if (mode === 'edit') {
            setPropertyForm(data);
        } else {
            setPropertyForm(resetPropertyState);
            setRooms([]);
        }
    }, [mode, data]);

    const reset = () => {
        console.log('reset called');
        setCities([]);
        setStates([]);
        setSelectedCity([]);
        setSelectedState([]);
        setRoomTypes([]);
        setRoomSelection('');
        setRooms([]);
        setRoomCount(0);
        setPropertyForm(resetPropertyState);
    }

    const handleCloseButton = () => {
        if (mode === 'edit' && fn && fn.handleEditPropertyClose) {
            reset();
            fn.handleEditPropertyClose();
        }
        if (mode === 'add' && fn && fn.handleAddPropertyClose) {
            reset();
            fn.handleAddPropertyClose();
        }
    }

    const createProperty = () => {
        const propertyObj = {
            ...propertyForm,
            rooms
        };
        addProperty(dispatch, propertyObj, (err, successFlag) => {
            if (successFlag) {
                if (fn && fn.refreshData) {
                    fn.refreshData();
                }
                if (fn && fn.handleAddPropertyClose) {
                    setPropertyForm(resetPropertyState);
                    fn.handleAddPropertyClose();
                }
            }
        });
    }

    const editProperty = () => {
        console.log('propertyForm => ', propertyForm);
        const tempObj = {...propertyForm};
        modifyProperty(dispatch, tempObj, (err, successFlag) => {
            if (successFlag) {
                if (fn && fn.refreshData) {
                    fn.refreshData();
                }
                handleCloseButton();
            }
        });
    }

    const submitProperty = () => {
        // Add shop id here to the object
        // console.log('submit product called ==> ',mode, propertyForm);
        if (mode === 'add') {
            createProperty();
        } else {
            editProperty();
        }
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const res = await uploadImageToCloud(dispatch, e.target.files[0]);
          // console.log(res.data.secure_url);
        const {data: {secure_url}} = res;
        if (secure_url) {
            dispatch(setToast({
                type: 'success',
                message: 'Property image uploaded successfully!'
            }));
        }
        const tempForm = {...propertyForm};
        tempForm.image = secure_url;
        setPropertyForm(tempForm);
    };

    const onPropertyFormChange = (e) => {
        const fieldName = e.target.getAttribute('id');
        const tempForm = {...propertyForm};
        tempForm[fieldName] = e.target.value;
        setPropertyForm(tempForm);
    }

    const onCountryChange = (selected) => {
        setCountry(selected);
        const [country] = selected;
        console.log('country -> ', country);
        if (!country || !country.isoCode) {
            return;
        }
        propertyForm.country = selected && selected[0] && selected[0].name;
        setAllStates(State.getStatesOfCountry(country.isoCode));
        setSelectedState([]);
        setSelectedCity([]);
    }

    const addSelectedRoom = () => {
        console.log(roomSelection, roomCount);
        const tmpRooms = rooms.slice();
        tmpRooms.push({
            roomtypename: roomSelection,
            count: roomCount
        });
        setRooms(tmpRooms);
        setRoomSelection('');
        setRoomCount(0);
    }

    const getRoomTypeName = (id) => {
        console.log('getRoomTypeName id -> ', id);
        const roomMap = {};
        roomTypes.map(rt => {
            roomMap[rt.roomtypeid] = rt.roomtypename
        });
        return roomMap[id];
    }

    return (
        <div className="container">
            <Modal show={showFlag} dialogClassName="modal-90w" onHide={handleCloseButton}>
                <Modal.Header closeButton>
                    <Modal.Title>{mode && mode === 'edit' ? `Modify Property - ${data.hotel_name}` : 'Add Property'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="property_details">
                        <Form.Label htmlFor="hotel_name">Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="hotel_name"
                            aria-describedby="hotel_name"
                            value={propertyForm.hotel_name}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="image_upload">Image</Form.Label>
                        <Form.Control
                            type="file"
                            id="image_upload"
                            aria-describedby="image_upload"
                            onChange={uploadImage}
                          />
                        <Form.Label htmlFor="image">Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            id="image"
                            aria-describedby="image"
                            value={propertyForm.image}
                            disabled={true}
                          />
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control
                            type="text"
                            id="description"
                            aria-describedby="description"
                            value={propertyForm.description}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="hotel_addr">Hotel Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="hotel_addr"
                            aria-describedby="hotel_addr"
                            value={propertyForm.hotel_addr}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="hotel_phone">Hotel Phone</Form.Label>
                        <Form.Control
                            type="text"
                            id="hotel_phone"
                            aria-describedby="hotel_phone"
                            value={propertyForm.hotel_phone}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="hotelbaseprice">Price</Form.Label>
                        <Form.Control
                            type="text"
                            id="hotelbaseprice"
                            aria-describedby="hotelbaseprice"
                            value={propertyForm.hotelbaseprice}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="summary">Summary</Form.Label>
                        <Form.Control
                            type="text"
                            id="summary"
                            aria-describedby="summary"
                            value={propertyForm.summary}
                            onChange={onPropertyFormChange}
                          />
                        <Form.Label htmlFor="country">Country</Form.Label>
                        <Typeahead
                          id="country"
                          onChange={onCountryChange}
                          labelKey={option => `${option.name} ${option.flag}`}
                          options={Country.getAllCountries()}
                          selected={country}
                        />
                        <Form.Label htmlFor="state">State</Form.Label>
                        <Typeahead
                          id="state"
                          onChange={selected => {
                            setSelectedState(selected);
                            setCities(City.getCitiesOfState(selected && selected[0] && selected[0].countryCode, selected && selected[0] && selected[0].isoCode));
                            propertyForm.state = selected && selected[0] && selected[0].name;
                          }}
                          labelKey={option => `${option.name}`}
                          options={allStates}
                          selected={selectedState}
                        />
                        <Form.Label htmlFor="city">City</Form.Label>
                        <Typeahead
                          id="city"
                          onChange={selected => {
                            setSelectedCity(selected);
                            propertyForm.city = selected && selected[0] && selected[0].name;
                          }}
                          labelKey={option => `${option.name}`}
                          options={cities}
                          selected={selectedCity}
                        />
                        {
                            mode === 'add' && <div className="room_details">
                                <Form.Label htmlFor="room_type">Add a room</Form.Label>
                                <Row>
                                <Col xs={8}> 
                                    <Form.Select id="room_type" aria-label="room type select" value={roomSelection} onChange={e => setRoomSelection(e.target.value)}>
                                      <option>Select</option>
                                      {
                                        roomTypes && roomTypes.map(rtype => <option value={rtype.roomtypename}>{rtype.roomtypename}</option>)
                                      }
                                    </Form.Select>
                                </Col>
                                <Col xs={2}>
                                    <Form.Control
                                        type="text"
                                        id="roomCount"
                                        aria-describedby="roomCount"
                                        value={roomCount}
                                        onChange={e => setRoomCount(e.target.value)}
                                      />
                                </Col>
                                <Col xs={2} style={{textAlign: 'right'}}> 
                                    <Button variant="outline-primary" onClick={() => addSelectedRoom()}>Add room</Button>
                                </Col>
                                </Row>
                                {
                                    rooms && rooms.length ? 
                                        <Table responsive>
                                          <thead>
                                            <tr>
                                              <th>#</th>
                                              <th>Type</th>
                                              <th>Count</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {
                                                rooms.map((r, i) => <tr>
                                                    <td>{i + 1}</td>
                                                    <td>{r.roomtypename}</td>
                                                    <td>{r.count}</td>
                                                    </tr>
                                                )
                                            }
                                          </tbody>
                                        </Table> : ''
                                }
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseButton()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitProperty()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModifyProperty;