import { combineReducers } from 'redux';

import appReducer from './appReducer';
import hotelReducer from './hotelReducer';
import hotelDetailsReducer from './hotelDetailsReducer';
import bookingsReducer from './bookingReducer';
import adminHotelsReducer from './adminHotelsReducer';

const rootReducer = combineReducers({
  app: appReducer,
  hotels: hotelReducer,
  hoteldetails: hotelDetailsReducer,
  bookings: bookingsReducer,
  adminhotels: adminHotelsReducer
})

export default rootReducer