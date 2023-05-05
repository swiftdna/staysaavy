import {
  ADD_ADMIN_HOTELS,
  LOADING_ADMIN_HOTELS,
  CLEAR_ADMIN_HOTELS,
  FETCH_ADMIN_HOTELS_ERROR
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function adminHotelsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ADMIN_HOTELS: {
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload
      }
    }
    case LOADING_ADMIN_HOTELS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_ADMIN_HOTELS:
      return {
        ...state,
        error: false,
        data: []
      }
    case FETCH_ADMIN_HOTELS_ERROR:
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