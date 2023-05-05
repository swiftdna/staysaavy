import {
   ADD_BOOKINGS,
   LOADING_BOOKINGS,
   FETCH_BOOKINGS_ERROR
} from '../constants/actionTypes';

function fetchBookingSuccess(data) {
   return {
      type: ADD_BOOKINGS,
      payload: data
   }
}

function fetchBookingFailure(data) {
   return {
      type: FETCH_BOOKINGS_ERROR,
      payload: data
   }
}

export function bookingsLoading() {
   return {
      type: LOADING_BOOKINGS
   }
}

export function handleBookingsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchBookingSuccess(data.data);
   } else {
      return fetchBookingFailure({
         message: data.message
      });
   }
}