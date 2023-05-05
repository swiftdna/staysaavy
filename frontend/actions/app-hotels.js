import {
   ADD_HOTELS,
   LOADING_HOTELS,
   FETCH_HOTELS_ERROR
} from '../constants/actionTypes';

function fetchHotelSuccess(data) {
   return {
      type: ADD_HOTELS,
      payload: data
   }
}

function fetchHotelFailure(data) {
   return {
      type: FETCH_HOTELS_ERROR,
      payload: data
   }
}

export function hotelsLoading() {
   return {
      type: LOADING_HOTELS
   }
}

export function handleHotelsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchHotelSuccess(data.data);
   } else {
      return fetchHotelFailure({
         message: data.message
      });
   }
}