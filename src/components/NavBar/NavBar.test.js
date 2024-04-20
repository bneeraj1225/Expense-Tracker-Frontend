// NavBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';

describe('NavBar Component', () => {
  test('renders NavBar with correct links', () => {
    render(
      <BrowserRouter>
        <NavBar onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('logout button calls onLogout function when clicked', () => {
    const handleLogout = jest.fn();
    render(
      <BrowserRouter>
        <NavBar onLogout={handleLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
