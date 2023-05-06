import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import { register } from '../utils';
import { setAlert } from '../actions/app-actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Register() {

	const [regForm, setRegForm] = useState({
		cust_email: '',
		cust_password: '',
		cust_name: ''
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onInputChange = (e) => {
		const tmpForm = {...regForm};
		const name = e.target.getAttribute('id');
		tmpForm[name] = e.target.value;
		setRegForm(tmpForm);
	}

	const submitRegister = () => {
		console.log('regForm => ', regForm);
		register(dispatch, regForm, (err, successFlag) => {
			if (successFlag) {
				navigate('/login');
			}
		});
	};

	const reset = () => {
		setRegForm({
			cust_email: '',
			cust_password: '',
			cust_name: ''
		});
	}

	return (
		<>
		<video autoPlay loop muted>
          <source src="bg_video.mp4" type="video/mp4" />
        </video>
		<div className="container">
			<div className="register-form-shadow">
			</div>
			<div className="register-form">
			<h5>Registration Form</h5>
			<Form>
				<Form.Group className="mb-3" controlId="cust_name">
					<Form.Label>Name</Form.Label>
					<Form.Control
					    type="text"
					    value={regForm.cust_name}
					    onChange={onInputChange}
					    aria-describedby="cust_name"
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="cust_email">
					<Form.Label>Email</Form.Label>
					<Form.Control
					    type="text"
					    value={regForm.cust_email}
					    onChange={onInputChange}
					    aria-describedby="cust_email"
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="cust_password">
					<Form.Label>Password</Form.Label>
					<Form.Control
					    type="password"
					    value={regForm.cust_password}
					    onChange={onInputChange}
					    aria-describedby="cust_password"
					/>
				</Form.Group>
			</Form>

			<div className="btn_panel">
				<Button variant="primary" onClick={() => submitRegister()}>Submit</Button>
				<Button variant="secondary" onClick={() => reset()}>Reset</Button>
			</div>
			</div>
		</div>
		</>
	)
}