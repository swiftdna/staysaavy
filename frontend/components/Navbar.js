import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaList, FaUserAlt, FaCircle, FaUserShield } from 'react-icons/fa';
import { selectIsLoggedIn, selectUser } from '../selectors/appSelector';
import { handleLogoutResponse } from '../actions/app-actions';

//create the Navbar Component
function Navbar() {
    const isAuthenticated = useSelector(selectIsLoggedIn);
    const userDetails = useSelector(selectUser);
    const isAdmin = userDetails && userDetails.user_role === 'admin';
    // const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated])

    const login = () => {
        navigate('/login');
    }

    const register = () => {
        navigate('/register');
    }

    const home = () => {
        navigate('/');
    }

    // const favourites = () => {
    //     navigate('/favourites');
    // }

    // const profile = () => {
    //     navigate('/profile');
    // }

    // const cart = () => {
    //     navigate('/cart');
    // }

    const bookings = () => {
        navigate('./bookings');
    };

    // const shop = () => {
    //     navigate('./shop');
    // }

    const logout = () => {
        axios.post('/logout')
            .then(response => {
                dispatch(handleLogoutResponse(response));
            });
    }

    const getClassName = () => {
        const {customer_type} = userDetails;
        return customer_type ? `usr_badge ${customer_type}` : 'usr_badge';
    }

    return(
        <nav className="navbar navbar-light bgnew-light justify-content-between">
            <div className="container">
                <div className="col-2">
                    <img onClick={() => home()} className="navbar-brand-logo" src="StaySaavyLogo.png" />
                    {isAdmin ? <span style={{fontSize: '10px', position: 'absolute',marginTop: '20px'}}>Admin</span> : ''}
                </div>
                <div className="col-8">
                    {/* 
                        <input style={{display: 'inline', width: '91%', borderTopRightRadius: 0, borderBottomRightRadius: 0}} className="form-control mr-sm-2" type="search" placeholder="Enter search text" aria-label="Search" />
                        <Button style={{display: 'inline', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginTop: '-4px'}} variant="warning">Search</Button>
                    */}
                </div>
                <div className="col-2 center-contents" style={{textAlign: 'right', marginRight: 0, paddingRight: 0}}>
                    {
                        isAuthenticated ? 
                        <button type="button" className="btn btn-light nav-buttons" title="Log out" onClick={() => logout()}>Logout</button> : 
                        <>
                            <Button variant="primary" className="nav-buttons-bkng" title="Log In" onClick={() => login()}>login</Button>
                            <Button variant="warning" className="nav-buttons-bkng" title="Log In" onClick={() => register()}>register</Button>
                        </>
                    }
                    {
                        isAuthenticated && (
                            <>
                                {!isAdmin ? <>
                                    {userDetails && userDetails.customer_type ? <span title="user rewards" className="usr_rewards"><FaCircle className={getClassName()} style={{fontSize: '10px'}} /> {userDetails.reward_points}</span> : ''}
                                    <FaList className="nav-buttons" title="Bookings" size="3em" onClick={() => bookings()}/>
                                    </> : ''}
                                {isAdmin ? <FaUserShield className="nav-buttons" title="Profile" size="3em" /> : <FaUserAlt className="nav-buttons" title="Profile" size="3em" /> }
                            </>)
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;