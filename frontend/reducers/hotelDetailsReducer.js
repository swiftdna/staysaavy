import {
  ADD_HOTEL_DETAILS,
  LOADING_HOTEL_DETAILS,
  CLEAR_HOTEL_DETAILS,
  FETCH_HOTEL_DETAILS_ERROR
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_HOTEL_DETAILS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_HOTEL_DETAILS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_HOTEL_DETAILS:
      return {
        ...state,
        data: []
      }
    case FETCH_HOTEL_DETAILS_ERROR:
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