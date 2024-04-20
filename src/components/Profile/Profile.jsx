import React, { useState, useEffect } from 'react';
import './Profile.css'; // Import CSS file
import NavBar from '../NavBar/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TokenExpirationModal from '../TokenExpirationModal/TokenExpirationModal';
import { BASE_URL } from '../../App';

function Profile({onLogout}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [tokenExpiresIn, setTokenExpiresIn] = useState(60000);
    const [showTokenExpirationAlert, setShowTokenExpirationAlert] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []); // Empty dependency array to only run once after component mounts


    useEffect(() => {
        // Fetch expenses from backend when the component mounts
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            const tokenExpirationTime = getTokenExpiration();
            const timeLeft = tokenExpirationTime - Date.now();
            setTokenExpiresIn(timeLeft);
            
            // Set up interval to update token expiration time every second
            const interval = setInterval(() => {
                const currentTimeLeft = tokenExpirationTime - Date.now();
                setTokenExpiresIn(currentTimeLeft);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [token]); // Empty dependency array to ensure it only runs once on component mount

    useEffect(() => {
        // Check if token is expired
        if (tokenExpiresIn && tokenExpiresIn <= 0) {
            // Clear local storage and navigate to desired route
            localStorage.clear();
            navigate('/');
            window.location.reload(); // Reload the page
        } else{
            setShowTokenExpirationAlert(true);
        }
    }, [tokenExpiresIn, navigate]); // Dependency on tokenExpiresIn to run whenever it changes


    const getTokenExpiration = () => {

        if(token){
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp * 1000; // Convert expiration time from seconds to milliseconds
        }
    };

    const renewToken = () => {
        const token = localStorage.getItem('token');

        // Call backend to renew token
        axios.post(`${BASE_URL}/users/auth/renewToken`,{}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const newToken = response.data.token;
                setToken(newToken);
                localStorage.setItem('token', newToken);
                setTokenExpiresIn( 60000 ); // Set token expiration time to 1 minute (60000 milliseconds)
            })
            .catch(error => {
                console.error('Error renewing token:', error);
            });
        setShowTokenExpirationAlert(false);
    };

    const handleRenewSession = () => {
        renewToken(); // Call renewToken directly
    };

    const handleCancel = () => {
        // Close the token expiration alert
        setShowTokenExpirationAlert(false);
        setDisplayAlert(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userid = localStorage.getItem('userid');
            const response = await axios.put(`${BASE_URL}/users/updateProfile/${userid}`, {
                name,
                phoneNumber
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                alert('Profile updated successfully!');
                // Optionally, you can update state or perform any other action after successful update
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            alert('Failed to update profile');
        }

    };

    const fetchProfileData = () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        fetch(`${BASE_URL}/users/getUser/email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to Profile data');
            }
            return response.json();
        })
        .then(data => {
            const user = data;
            setName(user.name);
            setEmail(user.email);
            setPhoneNumber(user.phoneNumber);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        if (value.length !== 10) {
            setPhoneNumberError('Phone number must be 10 digits');
        } else {
            setPhoneNumberError('');
        }
    };

    return (
        <div className="profile-page">
          <NavBar onLogout={onLogout}/>
          <div className="profile-container">
            <form onSubmit={handleUpdate} className="profile-form">
              <h2>Edit Profile</h2>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} disabled aria-label="Email"/>
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  aria-label="Phone Number"
                  aria-invalid={phoneNumberError ? "true" : "false"}
                    />
                {phoneNumberError && <p className="error-message" aria-live="assertive">{phoneNumberError}</p>}
              </div>
              <button type="submit" className="update-btn">Update</button>
            </form>
          </div>
          {tokenExpiresIn < 20000 && showTokenExpirationAlert && displayAlert &&(
                <TokenExpirationModal 
                isOpen={showTokenExpirationAlert} 
                onRenewSession={handleRenewSession} 
                onCancel={handleCancel}
                aria-label="Token Expiration Modal"
            />
            )}
        </div>
    );
}

export default Profile;