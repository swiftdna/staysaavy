import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Table, Button, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getHotelBookings, getShortDate } from "../utils";
import { useNavigate, useParams } from 'react-router-dom';

export function AdminHotelBookings() {

    const dispatch = useDispatch();
    // const hotelsData = useSelector((state) => state.adminhotels.data);
    // const loading = useSelector((state) => state.adminhotels.loading);
    const navigate = useNavigate();
    const urlParams = useParams();
    const { hotelID } = urlParams;
    const [bookingInfo, setBookingInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const hotelsData = useSelector((state) => state.adminhotels.data);

    const getHotelDetails = (id) => {
        const hotelsArr = hotelsData.filter(hotel => hotel.hotel_id === parseInt(hotelID));
        return hotelsArr && hotelsArr.length ? hotelsArr[0] : {};
    }

    useEffect(() => {
        async function fetchFilterData() {
            // Make a call here
            setLoading(true);
            const bookingsData = await getHotelBookings(hotelID);
            // const data = bookingsData;
            setBookingInfo(bookingsData);
            setLoading(false);
            // console.log(bookingsData);
        }

        fetchFilterData()
    }, [hotelID])
    
    const back = () => {
        navigate('/');
    };

    return (
        <div className="container" style={{marginTop: '10px'}}>
            <FaArrowLeft style={{color: '#0070BA', fontSize: '20px', cursor: 'pointer'}} onClick={() => back()} />
            <h4 style={{marginTop: '10px'}}>Bookings of {getHotelDetails().hotel_name}</h4>
            {loading ? <Spinner animation="border" size="lg" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner> : ''
            }
            {bookingInfo && bookingInfo.length ? <Table striped bordered hover style={{marginTop: '20px'}}>
              <thead>
                <tr>
                  <th style={{textAlign: 'center'}}>Reservation ID</th>
                  <th style={{textAlign: 'center'}}>Room Name</th>
                  <th style={{textAlign: 'center'}}>Booking Date</th>
                  <th style={{textAlign: 'center'}}>From Date</th>
                  <th style={{textAlign: 'center'}}>To Date</th>
                  <th style={{textAlign: 'center'}}>Total</th>
                  <th style={{textAlign: 'center'}}>Guests</th>
                </tr>
              </thead>
              <tbody>
                {bookingInfo.map(booking => <tr key={booking.reservation_id}>
                              <td style={{textAlign: 'center'}}>{booking.reservation_id}</td>
                              <td style={{textAlign: 'center'}}>{booking.roomtypename ? booking.roomtypename : 'Unknown'}</td>
                              <td style={{textAlign: 'center'}}>{getShortDate(booking.booking_date)}</td>
                              <td style={{textAlign: 'center'}}>{getShortDate(booking.start_date)}</td>
                              <td style={{textAlign: 'center'}}>{getShortDate(booking.end_date)}</td>
                              <td style={{textAlign: 'center'}}>{booking.amount}</td>
                              <td style={{textAlign: 'center'}}>{Array.from({ length: Number(booking.numberofguests) }).map((x, i) => <FaUser key={i} />)}
                              </td>
                        </tr>)} 
              </tbody>
            </Table> : ''}
            {!loading && (!bookingInfo || !bookingInfo.length) ? <p>No bookings found for the hotel</p> : ''}
        </div>
    )
}
export default AdminHotelBookings