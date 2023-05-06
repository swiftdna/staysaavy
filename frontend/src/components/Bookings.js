import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
// import DatePicker from "react-datepicker";
import BookingCard from "./BookingCard";
import ModifyBooking from "./ModifyBooking";
import { getBookings, cancelBooking } from "../utils";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
//Define a Home Component
export function Bookings() {

    const dispatch = useDispatch();
    const bookingsData = useSelector((state) => state.bookings.data);
    const loading = useSelector((state) => state.bookings.loading);
    const [modifyFlag, setModifyFlag] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getBookings(dispatch)
    }, [])

    // const openHotel = (dispatch, {id}) => {
    //     navigate(`/hotel/${id}`);
    // }

    const editBooking = (dispatch, id) => {
        const bookingsArr = bookingsData.filter(bd => bd.reservation_id === id);
        
        if (bookingsArr && bookingsArr.length) {
            setEditData(bookingsArr[0]);
            setModifyFlag(true);
        }
    }

    const removeBooking = (dispatch, id) => {
        cancelBooking(dispatch, id);
    }

    const handleEditBookingClose = (type) => {
        setEditData({});
        setModifyFlag(false);
    }
    
    return (
        <div className="container" style={{marginTop: '10px'}}>
            <h4>My Bookings</h4>
            {
                loading ? <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </Spinner> : ''
            }
            {!loading && bookingsData ?
                <Row>
                {
                    bookingsData.map(booking => <BookingCard key={booking.reservation_id} {...booking} fn={{editBooking, removeBooking}} />)
                }
                </Row> : ''
            }
            {!loading && (!bookingsData || !bookingsData.length) ?
                <p>No bookings found.</p> : ''
            }
            <ModifyBooking data={editData} showFlag={modifyFlag} fn={{handleEditBookingClose}}/>
        </div>
    )
}
export default Bookings;