import { handleLoginResponse, setToast, handleCountriesResponse } from './actions/app-actions';
import { handleHotelsResponse, hotelsLoading } from './actions/app-hotels';
import { handleAdminHotelsResponse, adminHotelsLoading } from './actions/app-admin-hotels';
import { handleBookingsResponse, bookingsLoading } from './actions/app-bookings';
import { handleHotelDetailsResponse, hotelDetailsLoading } from './actions/app-hotel-details';

import moment from 'moment';
// import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export function getShortDate(inputDate) {
    return moment(inputDate).format("YYYY-MM-DD");
}

export function register(dispatch, data, callback) {
    // const navigate = useNavigate();
    // dispatch(profileLoading());
    data.cust_phone = '3151355533';
    axios.post(`/api/users/signup`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({
                    type: 'Success',
                    message: data.message
                }));
                return callback(null, true);
                // navigate('login');
            } else {
                console.log('Registration failure');
                return callback(true);
            }
        }).catch(error => {
            const {data} = error.response;
            dispatch(setToast({
                type: 'Error',
                message: data.message
            }));
        });
}

export function checkSession(dispatch) {
    axios.get('/api/v1/session')
        .then(response => {
            dispatch(handleLoginResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function getAllHotels(dispatch, params) {
    const queryParams = params ? {
        city: params.place
    } : {};
    dispatch(adminHotelsLoading());
    axios.get('/api/admin/getallhotels', {params: queryParams})
        .then(response => {
            dispatch(handleAdminHotelsResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function getHotels(dispatch, params) {
    const queryParams = params ? {
        city: params.place,
        start_date: moment(params.startDate).format("YYYY-MM-DD"),
        end_date: moment(params.endDate).format("YYYY-MM-DD")
    } : {};
    dispatch(hotelsLoading());
    axios.get('/api/hotel/gethotels', {params: queryParams})
        .then(response => {
            dispatch(handleHotelsResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function getBookings(dispatch) {
    dispatch(bookingsLoading());
    axios.get('/api/reservation/getmybookings')
        .then(response => {
            dispatch(handleBookingsResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function getHotelDetails(dispatch, {hotelID, startDate, endDate}) {
    const hotelObj = {
       "hotel_id": hotelID,
       "start_date": startDate,
       "end_date": endDate,
       "daily_continental_breakfast": 0,
       "access_to_swimming_pool": 0,
       "access_to_fitness_room": 0,
       "daily_parking":0
    };
    dispatch(hotelDetailsLoading());
    axios.post(`/api/rooms/getrooms`, hotelObj)
        .then(response => {
            dispatch(handleHotelDetailsResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function uploadImageToCloud(dispatch, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('cloud_name', 'dac0hzhv5')
    formData.append('upload_preset', 'j8gp4zov')

    return axios.post(
      'https://api.cloudinary.com/v1_1/dac0hzhv5/image/upload',
      formData
    );
}

export function addProperty(dispatch, params, callback) {
    axios.post(`/api/admin/addhotel`, params)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                dispatch(setToast({
                    type: 'success',
                    message: 'Property added successfully!'
                }));
                getAllHotels(dispatch, params.shop_id);
            }
            callback(true);
        });
}

export function modifyProperty(dispatch, params, callback) {
    axios.put(`/api/admin/edithotel`, params)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                dispatch(setToast({
                    type: 'success',
                    message: 'Property modified successfully!'
                }));
                // getAllHotels(dispatch, params.hotel_id);
            }
            callback(true);
        });
}

export async function getRoomTypes() {
    const results = await axios.get(`/api/rooms/room_types`);
    // console.log(results.data/);
    return results.data.data;
}

export function filterHotelsWithAmenities(data) {
    const { hotel_id, start_date, end_date } = data;
    const tempObj = {
       hotel_id, start_date, end_date,
       "daily_continental_breakfast": data['daily_continental_breakfast'] ? 1 : 0,
       "access_to_swimming_pool": !!data['access_to_swimming_pool'] ? 1 : 0,
       "access_to_fitness_room": !!data['access_to_fitness_room'] ? 1 : 0,
       "daily_parking":!!data['daily_parking'] ? 1 : 0
    };
    return axios.post(`/api/rooms/getrooms`, tempObj);
}

export function bookRoom(dispatch, data, callback) {
    axios.post(`/api/reservation/bookrooms`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                checkSession(dispatch);
                dispatch(setToast({
                    type: 'success',
                    message: 'Property booked successfully!'
                }));
            }
            callback(true);
        });
}

export async function getHotelBookings(id) {
    const results = await axios.get(`/api/admin/getbookings?hotel_id=${id}`);
    // console.log(results.data/);
    return results.data.data;
}

export async function getPriceChecked(data) {
    const results = await axios.post(`/api/reservation/checkmodificationavailability`, data);
    // console.log(results.data/);
    const {success, data: output, message} = results.data;
    if (!success) {
        return {
            error: message
        };
    }
    return output;
}

export async function changeBooking(dispatch, data) {
    const { hotel_id } = data;
    delete data.hotel_id;
    const results = await axios.post(`/api/reservation/modifybooking`, data);
    // console.log(results.data/);
    const responseData = results.data;
    if (responseData.success) {
        checkSession(dispatch);
        dispatch(setToast({
            type: 'success',
            message: 'Booking modified successfully!'
        }));
        getBookings(dispatch);
    }
    return responseData;
}

export async function cancelBooking(dispatch, reservationID) {
    const data = { reservation_id: reservationID };
    const results = await axios.post(`/api/reservation/cancelbooking`, data);
    // console.log(results.data/);
    const responseData = results.data;
    if (responseData.success) {
        checkSession(dispatch);
        dispatch(setToast({
            type: 'success',
            message: 'Booking cancelled successfully!'
        }));
        getBookings(dispatch);
    }
    return responseData;
}
