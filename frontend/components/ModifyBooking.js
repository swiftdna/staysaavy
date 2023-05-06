import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Table, InputGroup, Button, FormControl, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { getPriceChecked, getShortDate, changeBooking } from '../utils';
import { setToast } from '../actions/app-actions';
import moment from 'moment';

function ModifyBooking({data, showFlag, fn}) {
    const dispatch = useDispatch();
    const [bookingForm, setBookingForm] = useState({});
    const [priceCheck, setPriceCheck] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [tmpRoomObj, setTmpRoomObj] = useState({});

    const reset = () => {
        setUserMessage('');
        setTmpRoomObj({});
        setPriceCheck(false);
        setBookingForm({});
    }

    const makeBooking = async () => {
        const {room_id, roombaseprice} = tmpRoomObj;
        const {hotel_id, reservation_id, booking_date, start_date, end_date} = bookingForm;
        const bookingObj = {
            hotel_id,
            reservation_id,
            booking_date: getShortDate(booking_date),
            start_date: getShortDate(start_date),
            end_date: getShortDate(end_date),
            room_id,
            "amount": roombaseprice
        };
        console.log('makeBooking called - ', bookingObj);
        const changeResponse = await changeBooking(dispatch, bookingObj);
        console.log(changeResponse);
        if (changeResponse.success) {
            reset();
            handleCloseButton();
        }
    }

    const submitBooking = async () => {
        // console.log('submit booking called ==> ', bookingForm);
        // Do a price check
        const { hotel_id, start_date, end_date, roomtypename, numberofguests } = bookingForm;
        const priceCheckObj = {
            hotel_id, start_date, end_date, roomtypename, numberofguests
        };
        if (!priceCheck) {
            const priceCheckResults = await getPriceChecked(priceCheckObj);
            const {room_id, roombaseprice, error} = priceCheckResults;
            setTmpRoomObj({room_id, roombaseprice});
            setPriceCheck(true);
            if (error) {
                setUserMessage(error);
                return;
            }
            if (roombaseprice === (bookingForm.amount)) {
                // amount is same, continue to book
                makeBooking();
            } else {
                setUserMessage(`The price for the room has changed to $${roombaseprice}. Confirm again if you want to proceed?`);
            }
        } else {
            // User has see the message and wants to book
            makeBooking();
        }
    };

    useEffect(() => {
        setBookingForm({...data, start_date: moment(data.start_date).toDate(), end_date: moment(data.end_date).toDate()});
    }, [data])

    const handleCloseButton = () => {
        if (fn && fn.handleEditBookingClose) {
            fn.handleEditBookingClose();
            reset();
        }
    }

    return (
        <div className="container">
            <Modal show={showFlag} onHide={handleCloseButton}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="booking_details">
                        <Form.Label htmlFor="start_date">Start Date</Form.Label>
                        <DatePicker className="form-control" selected={bookingForm.start_date} 
                            onChange={(date:Date) => setBookingForm({...bookingForm, start_date: date})} />
                        <Form.Label htmlFor="hotel_name" style={{marginTop: '10px'}}>End Date</Form.Label>
                        <DatePicker className="form-control" selected={bookingForm.end_date} 
                            onChange={(date:Date) => setBookingForm({...bookingForm, end_date: date})} />
                    </div>
                    {userMessage ? <div className="user-alert">
                            <p>{userMessage}</p>
                        </div> : ''}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseButton()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitBooking()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModifyBooking;