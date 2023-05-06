import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from "react-datepicker";
import PropertyCard from "./PropertyCard";
import Loader from "./Loader";
import ModifyProperty from "./ModifyProperty";
import { getAllHotels } from "../utils";
import { useNavigate } from 'react-router-dom';
import { Country, State, City }  from 'country-state-city';
import { Typeahead } from 'react-bootstrap-typeahead';

export function AdminDashboard() {

    const dispatch = useDispatch();
    const [country, setCountry] = useState([{
        "isoCode": "US",
        "name": "United States",
        "phonecode": "1",
        "flag": "🇺🇸",
        "currency": "USD",
        "latitude": "38.00000000",
        "longitude": "-97.00000000",
        "timezones": [
        ]
    }]);
    const [state, setState] = useState([
        {
            "name": "California",
            "isoCode": "CA",
            "countryCode": "US",
            "latitude": "36.77826100",
            "longitude": "-119.41793240"
        }
    ]);
    const [value, setValue] = useState([
        {
            "name": "San Jose",
            "countryCode": "US",
            "stateCode": "CA",
            "latitude": "37.33939000",
            "longitude": "-121.89496000"
        }
    ]);
    const [cities, setCities] = useState([]);
    const [allStates, setAllStates] = useState([]);

    const hotelsData = useSelector((state) => state.adminhotels.data);
    const loading = useSelector((state) => state.adminhotels.loading);
    const navigate = useNavigate();
    const [showFlag, setShowFlag] = useState(false);
    const [mode, setMode] = useState('');
    const [editData, setEditData] = useState({});

    useEffect(() => {
        // getAllHotels(dispatch);
        submit();
        setCities(City.getCitiesOfState('US', 'CA'));
        setAllStates(State.getStatesOfCountry('US'));
    }, [])

    const openHotel = (dispatch, {hotel_id}) => {
        // navigate(`/hotel/${hotel_id}`);
        navigate(`/admin/${hotel_id}/bookings`);
    }


    const submit = () => {
        const [lclcity] = value;
        const [stateValue] = state;
        const temp = {
            place: lclcity.name
            // place: lclcity.name.split(' ').join('').toLowerCase()
        };
        // place lowercase joining must be removed later
        console.log(temp);
        getAllHotels(dispatch, temp);
    }

    const refreshData = () => {
        submit();
    }

    const onStateChange = (selected) => {
        setState(selected);
        console.log(selected);
        const [state] = selected;
        if (!state || !state.countryCode || !state.isoCode) {
            return;
        }
        setCities(City.getCitiesOfState(state.countryCode, state.isoCode));
    }

    const onCountryChange = (selected) => {
        setCountry(selected);
        const [country] = selected;
        if (!country || !country.isoCode) {
            return;
        }
        // console.log(Country.getStatesOfCountry(country.countryCode));
        setAllStates(State.getStatesOfCountry(country.isoCode));
        setState([]);
        setValue([]);
    }

    const toggleModal = (type) => {
        setMode(type);
        setShowFlag(!showFlag);
    }

    const handleEditPropertyClose = () => {
        toggleModal('edit');
    }

    const handleAddPropertyClose = () => {
        toggleModal('add');
    }

    const editHotel = (dispatch, id, data) => {
        console.log('data ===> ', data);
        // Pluck required fields
        const filteredData = {
            city: data.city,
            description: data.description,
            hotel_addr: data.hotel_addr,
            hotel_id: data.hotel_id,
            hotel_name: data.hotel_name,
            hotel_phone: data.hotel_phone,
            hotelbaseprice: data.hotelbaseprice,
            image: data.image,
            summary: data.summary
        };
        console.log('filteredData data ===> ', filteredData);

        setEditData(filteredData);
        toggleModal('edit');
    }
    
    return (
        <div className="container" style={{marginTop: '10px'}}>
            <Row>
                <Col xs={10}>
                    <h4>Your properties</h4>
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <Button variant="primary" onClick={() => toggleModal('add')}>Add property</Button>
                </Col>
            </Row>
            <Row className="top_filter" style={{marginTop: '20px'}}>
                <Col xs={3}>
                    <Typeahead
                      id="city"
                      onChange={selected => {
                        setValue(selected)
                      }}
                      labelKey={option => `${option.name}`}
                      options={cities}
                      selected={value}
                    />
                </Col>
                <Col xs={3}>
                    <Typeahead xs={1}
                      id="state"
                      onChange={onStateChange}
                      labelKey={option => `${option.name} ${option.countryCode}`}
                      options={allStates}
                      selected={state}
                    />
                </Col>
                <Col xs={3}>
                    <Typeahead xs={1}
                      id="country"
                      onChange={onCountryChange}
                      labelKey={option => `${option.name} ${option.flag}`}
                      options={Country.getAllCountries()}
                      selected={country}
                    />
                </Col>
                <Col xs={3}>
                    <Button variant="outline-primary" style={{width: '100%'}} onClick={() => submit()}>Submit</Button>
                </Col>
            </Row>
            <Row>
                {
                    loading ? <Loader /> : 
                        <>
                            <Row>
                                { hotelsData ? <p style={{marginBottom: '5px'}} >{hotelsData.length} properties found</p> : 
                                    <p style={{marginBottom: '5px'}} >No properties found</p>
                                }
                            </Row>
                            <Col>
                                {
                                    hotelsData && hotelsData.map(hotel => <PropertyCard type="admin" key={hotel.hotel_id} {...hotel} fn={{openHotel, editHotel}}/>)
                                }
                            </Col>
                        </>
                }
                
            </Row>
            <ModifyProperty mode={mode} data={editData} showFlag={showFlag} fn={{handleEditPropertyClose, handleAddPropertyClose, refreshData}}/>
        </div>
    )
}
export default AdminDashboard;