import './App.css';
import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Homepage from './components/Homepage/Homepage';
import Visualization from './components/Visualization/Visualization';
import Profile from './components/Profile/Profile';

export const FRONTEND_BASE_URL = `http://localhost:3000`;
export const BASE_URL = `https://expense-tracker-backend-ynae9.ondigitalocean.app`;


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            console.log(token)
            setIsLoggedIn( true );
            console.log( isLoggedIn );
            // navigate('/homepage'); // Redirect to homepage after successful signup
        }
    }, []); // Empty dependency array to run only once when component mounts

    const handleSignup = () => {
        setIsLoggedIn(true);
    };

    const handleSignout = () => {
        setIsLoggedIn(false);
    }

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path='/homepage'
                        element={isLoggedIn ? <Homepage onLogout={handleSignout}/> : <Navigate to="/" />}
                    />
                    <Route 
                        path='/login' 
                        element={ isLoggedIn ? <Homepage onLogout={handleSignout}/> : <Login onLoginOrSignup={handleSignup} /> } 
                    />
                    <Route 
                        path='*'
                        element={ isLoggedIn ? <Homepage onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />} 
                    />
                    <Route 
                        path='/dashboard' 
                        element={ isLoggedIn ? <Visualization onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />}
                    />
                    <Route 
                        path='/profile' 
                        element={ isLoggedIn ? <Profile onLogout={handleSignout}/> : <Signup onLoginOrSignup={handleSignup} />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
