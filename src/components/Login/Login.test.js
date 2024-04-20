import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios'; // Mock axios
import Login from './Login';
import { BASE_URL } from '../../App';


jest.mock('axios'); // Mock axios module

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login component', () => {
  it('should display error messages for invalid input', async () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    // Trigger form submission with empty fields
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for the error messages to appear
    await waitFor(() => {
      expect(getByText('Email is required')).toBeInTheDocument();
      expect(getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    const mockResponse = {
      data: {
        token: 'mockToken',
        userid: 'mockUserId',
      },
    };

    axios.post.mockResolvedValue(mockResponse); // Mock axios post method
    // Mock useNavigate function
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    const handleSignupMock = jest.fn(); // Mock function for handleSignup

    const { getByText, getByPlaceholderText } = render(<Login onLoginOrSignup={handleSignupMock} />); // Pass the mock function

    // Fill in the form fields
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for form submission and redirection
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/users/login`, {
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: '',
            name: '',
            phoneNumber: ""
          });
          
      expect(localStorage.getItem('token')).toBe('mockToken');
      expect(localStorage.getItem('email')).toBe('test@example.com');
      expect(localStorage.getItem('userid')).toBe('mockUserId');
      expect(mockNavigate).toHaveBeenCalledWith('/homepage');
      expect(handleSignupMock).toHaveBeenCalled(); // Ensure that the mock function is called
    });
  });
});