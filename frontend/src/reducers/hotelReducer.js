import {
  ADD_HOTELS,
  LOADING_HOTELS,
  CLEAR_HOTELS,
  FETCH_HOTELS_ERROR
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_HOTELS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_HOTELS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_HOTELS:
      return {
        ...state,
        data: []
      }
    case FETCH_HOTELS_ERROR:
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