import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { handleLoginResponse } from '../actions/app-actions';
import { selectIsLoggedIn } from '../selectors/appSelector';

//Define a Login Component
export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    const usernameChangeHandler = (e) => {
        const inputValue = e.target.value;
        setUsername(inputValue);
    }

    const passwordChangeHandler = (e) => {
        const inputValue = e.target.value;
        setPassword(inputValue);
    }

    //submit Login handler to send a request to the node backend
    const submitLogin = () => {
        const data = {
            cust_email: username,
            cust_password: password
        };
        //set the with credentials to true
        // axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('/api/users/login',data)
            .then(response => {
                dispatch(handleLoginResponse(response));
            }).catch(error => {
                dispatch(handleLoginResponse(error.response));
            });
    }

    return (
        <>
        <video autoPlay loop muted>
          <source src="bg_video.mp4" type="video/mp4" />
        </video> 
        <div className="container">
            <div className="login-form-shadow">
            </div>
            <div className="login-form">
                <div className="main-div">
                    <div className="login-panel">
                        <h2>Login</h2>
                        <p>Please enter your username and password</p>
                        <div className="form-group">
                            <input onChange = {usernameChangeHandler} type="text" className="form-control" name="username" value={username} placeholder="Username"/>
                        </div>
                        <div className="form-group" style={{marginTop: '10px'}}>
                            <input onChange = {passwordChangeHandler} type="password" className="form-control" name="password" value={password} placeholder="Password"/>
                        </div>
                        <button onClick = {() => submitLogin()} style={{marginTop: '20px'}} className="btn btn-primary">Login</button>                 
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Login;