import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

// Mock the localStorage getItem method
const localStorageMock = {
  getItem: jest.fn()
};
global.localStorage = localStorageMock;

test('renders login form when not logged in', () => {
  // Mock that there is no token in localStorage
  localStorageMock.getItem.mockReturnValue(null);
  
  render(<App />);

  // Check if the login form is rendered
  const signupTitles = screen.queryAllByText(/Sign up/i);
  // There are two signup titles, one as the signup form and one for the signup button
  expect(signupTitles).toHaveLength(2);
  const signupTitle = signupTitles[0];
  expect(signupTitle).toBeInTheDocument();

  // Check if the login link is present
  const loginLink = screen.getByText(/Login/i);
  expect(loginLink).toBeInTheDocument();
});