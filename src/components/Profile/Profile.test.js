import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './Profile';
import { BASE_URL } from '../../App';

const mockOnLogout = jest.fn();

// Mock window.alert
global.alert = jest.fn();

describe('Profile Component', () => {
  let axiosMock;
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  test('submits profile update form with valid data', async() => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890'
    };
    const successMockData = { success: true, message: "Updated successfully" }

    axiosMock.onGet(`${BASE_URL}/users/getUser/email=${mockUserData.email}`).reply(200, [mockUserData]);
    axiosMock.onPut(`${BASE_URL}/users/updateProfile/mockUserId`).reply(200,successMockData);

    // Set token and email in local storage
    localStorageMock.getItem.mockReturnValueOnce('mock_token');
    localStorageMock.getItem.mockReturnValueOnce(mockUserData.email);

    render(
      <Router>
        <Profile onLogout={mockOnLogout} />
      </Router>
    );

    // Wait for the user data to be fetched
    await waitFor(() => screen.getByLabelText('Name:'));

    // Update name and phone number
    const nameInput = screen.getByLabelText('Name:');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    const phoneNumberInput = screen.getByLabelText('Phone Number:');
    fireEvent.change(phoneNumberInput, { target: { value: '9876543210' } });

    // Submit form
    fireEvent.click(screen.getByText('Update'));

    // Wait for the form submission
    await waitFor(() => {
      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].data).toEqual(JSON.stringify({ name: 'John Doe', phoneNumber: '9876543210' }));
      expect(global.alert).toHaveBeenCalledWith('Failed to update profile'); // Check if alert was called
      expect(mockOnLogout).toHaveBeenCalledTimes(0); // Logout should not be called
    });
  });

  // Add more test cases as needed
});
