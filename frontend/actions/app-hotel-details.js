import {
   ADD_HOTEL_DETAILS,
   LOADING_HOTEL_DETAILS,
   FETCH_HOTEL_DETAILS_ERROR
} from '../constants/actionTypes';

function fetchHotelDetailsSuccess(data) {
   return {
      type: ADD_HOTEL_DETAILS,
      payload: data
   }
}

function fetchHotelDetailsFailure(data) {
   return {
      type: FETCH_HOTEL_DETAILS_ERROR,
      payload: data
   }
}

export function hotelDetailsLoading() {
   return {
      type: LOADING_HOTEL_DETAILS
   }
}

export function handleHotelDetailsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchHotelDetailsSuccess(data.data);
   } else {
      return fetchHotelDetailsFailure({
         message: data.message
      });
   }
}