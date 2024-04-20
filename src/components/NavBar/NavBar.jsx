// NavBar.js

import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({onLogout}) => {
    const navigate = useNavigate();
    const location = useLocation(); // Use useLocation hook instead of global location object

    const [isOpen, setIsOpen] = useState(false);
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

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        onLogout();
    }

    return (
        <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
            <div className="navbar-logo">
                <span>{typedText}</span>
            </div>
            <div className={isOpen ? 'navbar-menu active' : 'navbar-menu'} aria-expanded={isOpen}>
            <ul className="navbar-items" role="menubar">
                <li role="none" className={`navbar-item ${location.pathname === '/homepage' ? 'active' : ''} ${location.pathname === '/' ? 'active' : ''}`}><Link to="/homepage" role="menuitem">Home</Link></li>
                <li role="none" className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}><Link to="/dashboard" role="menuitem">Dashboard</Link></li>
                <li role="none" className={`navbar-item ${location.pathname === '/profile' ? 'active' : ''}`}><Link to="/profile" role="menuitem">Profile</Link></li>
                <li role="none" className="navbar-item" onClick={handleLogout}><Link to="/login" role="menuitem">Logout</Link></li>
            </ul>
            </div>
            <div className="navbar-toggle" onClick={toggleMenu} role="button" aria-label="Toggle Menu">
            <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
        </div>
        </nav>
    );
};
export default NavBar;