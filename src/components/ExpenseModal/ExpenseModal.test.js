// ExpenseModal.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ExpenseModal from './ExpenseModal';
import { BASE_URL } from '../../App';


const mockAddExpense = jest.fn();
const mockOnClose = jest.fn();

describe('ExpenseModal Component', () => {
  let axiosMock;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  test('renders modal with add expense title', () => {
    render(
      <ExpenseModal isOpen={true} onClose={mockOnClose} addExpense={mockAddExpense} />
    );

    expect(screen.getByText('Add Expense')).toBeInTheDocument();
  });

  test('renders modal with edit expense title when data is provided', () => {
    const mockData = {
      _id: '123',
      title: 'Groceries',
      category: "Groceries",
      price: 50,
      date: '2024-04-15',
      expectedPrice: 100
    };

    render(
      <ExpenseModal isOpen={true} onClose={mockOnClose} addExpense={mockAddExpense} data={mockData} />
    );

    expect(screen.getByText('Edit Expense')).toBeInTheDocument();
  });

  test('submits form with valid data and adds new expense', async () => {
    const mockData = {
      title: 'Groceries',
      category: 'Groceries',
      price: '50',
      date: '2024-04-15',
      expectedPrice: '100'
    };
  
    axiosMock.onPost(`${BASE_URL}/expenses/addExpenses`).reply(200, { success: true, _id: '123' });
  
    render(
      <ExpenseModal isOpen={true} onClose={mockOnClose} addExpense={mockAddExpense} />
    );
  
    fireEvent.change(screen.getByPlaceholderText('Enter expense title...'), { target: { value: mockData.title } });
    fireEvent.change(screen.getByPlaceholderText('Enter actual price...'), { target: { value: mockData.expectedPrice } });
    fireEvent.change(screen.getByLabelText('Expense Purchase Date:'), { target: { value: mockData.date } });
    fireEvent.change(screen.getByPlaceholderText('Enter expected price...'), { target: { value: mockData.price } });
 

    const selectElement = screen.getByTestId('categorySelect');
    fireEvent.change(selectElement, { target: { value: mockData.category } });




  
    fireEvent.click(screen.getByText('Add'));
  
    await waitFor(() => {
      expect(mockAddExpense).toHaveBeenCalledTimes(1);
      expect(mockAddExpense).toHaveBeenCalledWith(
        { ...mockData, _id: '123' }, null
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
  
  

  // Add more test cases as needed
});
