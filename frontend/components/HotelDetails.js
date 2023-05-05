import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Image, Table, Spinner } from 'react-bootstrap';
import { getHotelDetails, filterHotelsWithAmenities, getShortDate, bookRoom } from '../utils';
import { useSelector, useDispatch } from 'react-redux';
import Loader from './Loader';
import { FaUser, FaDumbbell, FaSwimmer, FaUtensils, FaParking } from 'react-icons/fa';
import { pluck } from 'underscore';
// import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

//Define a HotelDetails Component
export function HotelDetails() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const urlParams = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    // const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());
    const resetFilterState = {
        daily_continental_breakfast: false,
        access_to_swimming_pool: false,
        access_to_fitness_room: false,
        daily_parking: false
    };
    const [filterForm, setFilterForm] = useState(resetFilterState);
    const hotelDetails = useSelector(state => state.hoteldetails.data);
    const loading = useSelector(state => state.hoteldetails.loading);
    const userDetails = useSelector(state => state.app.user);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [booking, setBooking] = useState(false);
    const { hotelID } = urlParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const [dynamicPricing, setDynamicPricing] = useState({});
    const [dynamicDiscountedPricing, setDynamicDiscountedPricing] = useState({});
    const [guestTracker, setGuestTracker] = useState({});
    const [filterRooms, setFilterRooms] = useState([]);

    useEffect(() => {
        console.log(userDetails);
        if (!userDetails || !userDetails.isLoggedIn) {
            navigate('/login');
        }
        getHotelDetails(dispatch, {hotelID, startDate, endDate})
    }, []);

    useEffect(() => {
        console.log('filterForm changed');
        getFilterValues();
    }, [filterForm]);

    const getFilterValues = () => {
        console.log('filter hit');
        async function fetchFilterData() {
            const filterData = await filterHotelsWithAmenities({...filterForm, hotel_id: hotelID, start_date: startDate, end_date: endDate});
            const {data} = filterData.data;
            console.log(data.rooms);
            if (data.rooms && Array.isArray(data.rooms)) {
                setLoadingFilters(false);
                const filters = pluck(data.rooms, 'roomtypename');
                setFilterRooms(filters);
            }
        }
        // Loader on
        setLoadingFilters(true);
        fetchFilterData();
    };

    const onSwitchChange = (e) => {
        const {id, checked} = e.target;
        setFilterForm({
            ...filterForm,
            [id]: checked
        });
    }

    const calculateDynamicPrice = (e, rd) => {
        const guest_count = parseInt(e.target.value);
        const tmpPrices = {...dynamicPricing};
        const config = {
            1: 1,
            2: 0.7,
            3: 0.55,
            4: 0.45
        };
        if (!rd.roombaseprice || !guest_count || guest_count > 4) {
            tmpPrices[rd.roomtypename] = rd.roombaseprice;
        }
        tmpPrices[rd.roomtypename] = Math.trunc(parseInt(rd.roombaseprice) * guest_count * config[guest_count]);
        console.log(tmpPrices);
        setGuestTracker({
            ...guestTracker,
            [rd.roomtypename]: guest_count
        });
        setDynamicPricing(tmpPrices);
    }

    const calculateDiscountedDynamicPrice = (e, rd) => {
        const guest_count = parseInt(e.target.value);
        const tmpPrices = {...dynamicPricing};
        const config = {
            1: 1,
            2: 0.7,
            3: 0.55,
            4: 0.45
        };
        if (!rd.roomdiscountedprice || !guest_count || guest_count > 4) {
            tmpPrices[rd.roomtypename] = rd.roomdiscountedprice;
        }
        tmpPrices[rd.roomtypename] = Math.trunc(parseInt(rd.roomdiscountedprice) * guest_count * config[guest_count]);
        console.log(tmpPrices);
        setGuestTracker({
            ...guestTracker,
            [rd.roomtypename]: guest_count
        });
        setDynamicDiscountedPricing(tmpPrices);
    }

    const bookHotelRoom = (row) => {
        const roomtypename = row.roomtypename;
        const numberofguests = guestTracker[roomtypename];
        const amount = dynamicDiscountedPricing[roomtypename] ? dynamicDiscountedPricing[roomtypename] : dynamicPricing[roomtypename];
        const bookingObj = {
            hotel_id: hotelID,
            booking_date: getShortDate(new Date),
            start_date: startDate,
            end_date: endDate,
            roomtypename,
            amount,
            numberofguests
        };
        setBooking(true);
        bookRoom(dispatch, bookingObj, (err, successFlag) => {
            if (successFlag) {
                setBooking(false);
                navigate('/bookings');
            }
        });
    }

    const canRender = (roomtypename) => {
        console.log(filterRooms, roomtypename);
        if (!filterRooms || !filterRooms.length) {
            return true;
        }
        return filterRooms.indexOf(roomtypename) !== -1 ? true : false;
    }

    const getDiscountedStyling = price => {
        if (!price) {
            return;
        }
        if (price && price > 0) {
            return 'discounted-price';
        }
    }

    const calculatePrices = (e, rd) => {
        calculateDynamicPrice(e, rd);
        calculateDiscountedDynamicPrice(e, rd);
    }

    return (
        <div className="container" style={{marginTop: '10px'}}>
            {(loading || booking) ? 
                <Loader /> : ''
            }
            {(!loading && !booking) && hotelDetails ? 
                <Row>
                    <Row>
                        <Col xs={4} style={{overflow: 'hidden'}}>
                            <Image src={hotelDetails.image} width="400" />
                        </Col>
                        <Col xs={8}>
                            <h5 className="property_title_clickable">{hotelDetails.hotel_name}</h5>
                            <p className="property_location">{hotelDetails.hotel_addr} {hotelDetails.city}</p>
                            <p>{hotelDetails.description}</p>
                            <p>{hotelDetails.summary}</p>
                            <p>Amenities along with their icons will come here</p>
                        </Col>
                    </Row>
                    <Row className="room_filters">
                        <Form.Check 
                            type="switch"
                            className="inline-filter"
                            id="daily_continental_breakfast"
                            label={<><FaUtensils className="filter-icons" /> <span>Continental Breakfast</span></>}
                            checked={filterForm.daily_continental_breakfast}
                            onChange={onSwitchChange}
                          />
                        <Form.Check 
                            type="switch"
                            className="inline-filter"
                            id="access_to_fitness_room"
                            label={<><FaDumbbell className="filter-icons" /> <span>Fitness Room</span></>}
                            checked={filterForm.access_to_fitness_room}
                            onChange={onSwitchChange}
                          />
                        <Form.Check 
                            type="switch"
                            className="inline-filter"
                            id="access_to_swimming_pool"
                            label={<><FaSwimmer className="filter-icons" /> <span>Swimming Pool</span></>}
                            checked={filterForm.access_to_swimming_pool}
                            onChange={onSwitchChange}
                          />
                        <Form.Check 
                            type="switch"
                            className="inline-filter"
                            id="daily_parking"
                            label={<><FaParking className="filter-icons" /> <span>Daily Parking</span></>}
                            checked={filterForm.daily_parking}
                            onChange={onSwitchChange}
                          />
                    </Row>
                    {loadingFilters ? <Loader /> : <Row className="room_details">
                        <Table responsive>
                          <thead>
                            <tr>
                                <th>Room Type</th>
                                <th>Max Persons</th>
                                <th>Price</th>
                                <th>Select Guests</th>
                                <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                                hotelDetails.rooms && hotelDetails.rooms.map(rd => 
                                    canRender(rd.roomtypename) ?
                                    <tr>
                                        <td>
                                            <p style={{fontWeight: 'bold'}}>{rd.type}</p>
                                            <p className="room_desc">{rd.roomtypename}</p>
                                            <p className="room_text">Only {rd.numberofrooms} rooms available</p>
                                        </td>
                                        <td>
                                            {
                                                Array.from({ length: Number(rd.maxguests) }).map(() => <FaUser />)
                                            }
                                        </td>
                                        <td className="pricing_display">
                                            {rd.roomdiscountedprice ? <p>${dynamicDiscountedPricing[rd.roomtypename] ? dynamicDiscountedPricing[rd.roomtypename] : rd.roomdiscountedprice}</p> : ''}
                                            <p className={getDiscountedStyling(rd.roomdiscountedprice)}>${dynamicPricing[rd.roomtypename] ? dynamicPricing[rd.roomtypename] : rd.roombaseprice}</p>
                                        </td>
                                        <td>
                                            <Form.Select aria-label="Guest count" onChange={e => calculatePrices(e, rd)}>
                                              <option value="0">Guest count</option>
                                              {
                                                Array.from({ length: Number(rd.maxguests) }).map((x, i) => <option value={i+1}>{i+1}</option>)
                                              }
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Button variant="primary" style={{float: 'right'}} onClick={() => bookHotelRoom(rd)}>Book</Button>
                                        </td>
                                    </tr> : ''
                                )
                            }
                          </tbody>
                        </Table>
                    </Row>}
                </Row> : ''
            }
        </div>
    )
}
export default HotelDetails;