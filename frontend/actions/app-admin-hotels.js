import {
   ADD_ADMIN_HOTELS,
   LOADING_ADMIN_HOTELS,
   FETCH_ADMIN_HOTELS_ERROR
} from '../constants/actionTypes';

function fetchAdminHotelSuccess(data) {
   return {
      type: ADD_ADMIN_HOTELS,
      payload: data
   }
}

function fetchAdminHotelFailure(data) {
   return {
      type: FETCH_ADMIN_HOTELS_ERROR,
      payload: data
   }
}

export function adminHotelsLoading() {
   return {
      type: LOADING_ADMIN_HOTELS
   }
}

export function handleAdminHotelsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchAdminHotelSuccess(data.data);
   } else {
      return fetchAdminHotelFailure({
         message: data.message
      });
   }
}