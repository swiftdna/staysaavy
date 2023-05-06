import {
  ADD_BOOKINGS,
  LOADING_BOOKINGS,
  CLEAR_BOOKINGS,
  FETCH_BOOKINGS_ERROR
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BOOKINGS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_BOOKINGS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_BOOKINGS:
      return {
        ...state,
        data: []
      }
    case FETCH_BOOKINGS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload
      }
    default:
      return state
  }
}