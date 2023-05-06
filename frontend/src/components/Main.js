import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route
} from "react-router-dom";
import Login from './Login';
import Navbar from './Navbar';
import Home from './Home';
import HotelDetails from './HotelDetails';
import Bookings from './Bookings';
// import Footer from './Footer';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import AdminHotelBookings from './AdminHotelBookings';
import { useLocation } from 'react-router-dom';
import { checkSession } from '../utils';
import { Toast, ToastContainer } from 'react-bootstrap';
import { selectAlertFlag, selectToastFlag, selectAlertMessage, selectAlertType, selectIsLoggedIn, selectUser } from '../selectors/appSelector';
import { clearToast } from '../actions/app-actions';

//Create a Main Component
export function Main() {
    const alert = useSelector(selectAlertFlag);
    const toast = useSelector(selectToastFlag);
    const alertMessage = useSelector(selectAlertMessage);
    const alertType = useSelector(selectAlertType);
    const isAuthenticated = useSelector(selectIsLoggedIn);
    const userDetails = useSelector(selectUser);
    const isAdmin = userDetails && userDetails.user_role === 'admin' ? true : false;
    const location = useLocation();
    const dispatch = useDispatch();
    const alertMapping = {
        'error': 'alert alert-danger',
        'success': 'alert alert-success',
        'warning': 'alert alert-warning',
        'info': 'alert alert-info'
    }
    
    useEffect(() => {
        checkSession(dispatch);
    }, [dispatch]);

    return(
        <>
            {(location.pathname !== '/register' && location.pathname !== '/login') ? <Navbar /> : ''}
            {
                alert ? 
                <div className="container pull-down">
                    <div className={alertMapping && alertMapping[alertType] ? alertMapping[alertType]: "alert alert-danger"} role="alert">
                        {alertMessage}
                    </div>
                </div> : ''
            }
            <ToastContainer className="p-3" position={'bottom-end'} style={{zIndex: 10}}>
                <Toast onClose={() => dispatch(clearToast())} show={toast} delay={4000} autohide>
                  <Toast.Header>
                    <strong className="me-auto">{alertType}</strong>
                  </Toast.Header>
                  <Toast.Body>{alertMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/hotel/:hotelID" element={<HotelDetails />} />
              <Route path="/admin/:hotelID/bookings" element={<AdminHotelBookings />} />
              <Route path="/" element={isAdmin ? <AdminDashboard /> : <Home />} />
            </Routes>
        </>
    )
}
//Export The Main Component
export default Main;