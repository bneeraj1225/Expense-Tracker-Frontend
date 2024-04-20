import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import axios from 'axios'; // Import Axios
import { MemoryRouter } from 'react-router-dom';

// Mock Axios post method
jest.mock('axios');

const onLoginOrSignup = jest.fn();

// Define a mock response for successful signup
const mockSuccessResponse = {
  data: {
    success: true,
    token: 'mockToken',
    email: 'test@example.com',
    userid: '123456'
  }
};

// Define a mock response for failed signup
const mockFailureResponse = {
    data: {
      success: false,
      message: 'Email already exists'
    }
};

describe('Signup Component', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    axios.post.mockReset();
  });

  test('renders signup form', () => {
    render(<Signup onLoginOrSignup={onLoginOrSignup}/>, { wrapper: MemoryRouter });

    // Check if the signup form elements are rendered
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('submits signup form with valid data', async () => {
    // Mock a successful signup response
    axios.post.mockResolvedValue(mockSuccessResponse);

    render(<Signup onLoginOrSignup={onLoginOrSignup}/>, { wrapper: MemoryRouter });

    // Fill out the signup form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'TestPassword123#' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'TestPassword123#' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });

    // Submit the form
    fireEvent.click(screen.getByText('Sign Up'));

    // Wait for the axios post request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Check if the onLoginOrSignup function is called
    expect(mockSuccessResponse.data.success).toBe(true);
  });

  test('displays error message for failed signup', async () => {
    // Mock a failed signup response
    axios.post.mockResolvedValue(mockFailureResponse);

    render(<Signup onLoginOrSignup={onLoginOrSignup}/>, { wrapper: MemoryRouter });

    // Fill out the signup form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'TestPassword123#' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'TestPassword123#' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });

    // Submit the form
    fireEvent.click(screen.getByText('Sign Up'));

    // Wait for the axios post request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Check if the error message is displayed
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });
});
