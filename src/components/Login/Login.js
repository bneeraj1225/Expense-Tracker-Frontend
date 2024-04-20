
import React, { useState, useEffect } from 'react';
import '../Signup/Signup.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../App';

const Login = ( {onLoginOrSignup} ) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});
    const url = `${BASE_URL}/users/login`;
    const [typedText, setTypedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const textToType = "Expense Tracker";

    useEffect(() => {
        const timer = setTimeout(() => {
        if (currentCharIndex < textToType.length) {
            setTypedText(prevTypedText => prevTypedText + textToType[currentCharIndex]);
            setCurrentCharIndex(prevIndex => prevIndex + 1);
        }
        }, 150); // Adjust the delay as needed

        return () => clearTimeout(timer);
    }, [currentCharIndex]);

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        if (!formData.email) {
        formIsValid = false;
        newErrors['email'] = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        formIsValid = false;
        newErrors['email'] = 'Email is not valid';
        }

        if (!formData.password) {
        formIsValid = false;
        newErrors['password'] = 'Password is required';
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try{
                const response = await axios.post(url, formData);
                const token = response.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('email', formData.email );
                localStorage.setItem('userid', response.data.userid );
                onLoginOrSignup(); // Call the onLoginOrSignup function passed from the App component
                navigate('/homepage'); // Redirect to homepage after successful signup
            }
            catch( error ){
                let newErrors = {};
                if (error.response && error.response.data) {
                    newErrors['password'] = error.response.data.message;
                } else {
                    newErrors['password'] = 'An error occurred during signup';
                }
                setErrors(newErrors);
            }
        }
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <div className="form-container bg-gray-dark-mktg">
            <div className="logo" role="heading" aria-level="1">
            <span>{typedText}</span>
            </div>
            <form className="signup-form" onSubmit={handleSubmit}>
            <div> Login </div>
                <hr/>

            <div className="form-group">
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={errors.email ? 'error login-form' : 'login-form'}
                aria-label="Email"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? 'error login-form' : 'login-form'}
                aria-label="Password"
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-group">
                <button type="submit" className="login-button">Login</button>
            </div>
            <div>
            Already have an account? <Link to="/" role="menuitem">Sign Up</Link>
            </div>
            </form>
        </div>
    );
};

export default Login;
