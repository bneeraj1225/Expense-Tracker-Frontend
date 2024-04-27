// Homepage.js
import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import './Homepage.css'; // Assuming you have a CSS file for styles
import ExpenseModal from '../ExpenseModal/ExpenseModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TokenExpirationModal from '../TokenExpirationModal/TokenExpirationModal';
import { BASE_URL } from '../../App';
import MonthlyExpensesForm from '../MonthlyExpensesForm/MonthlyExpensesForm';


function Homepage({onLogout}) {
    const navigate = useNavigate();
    const [selectedExpenseIndex, setSelectedExpenseIndex] = useState(null); // State to store the selected expense index
    const [expenseData, setExpenseData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [tokenExpiresIn, setTokenExpiresIn] = useState(60000);
    const [showTokenExpirationAlert, setShowTokenExpirationAlert] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(true);
    const [token, setToken] = useState(null);
    const [amount, setAmount] = useState();
    const [currentMonth,setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [expensesFetched,setExpensesFetched] = useState(false);

    const openModal = () => {
        setExpenseData({}); // Reset expense data when modal is opened
        setIsModalOpen(true);
    };

    useEffect(() => {
        // Fetch expenses from backend when the component mounts
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            if(!expensesFetched){
                fetchExpenses(token);
            }
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

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchExpenses = (token) => {
        const email = localStorage.getItem('email');
        // You need to replace the URL with your actual backend API endpoint
        fetch(`${BASE_URL}/expenses/fetchExpenses/email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            return response.json();
        })
        .then(data => {
            if(data.success === false){
                return;
            }
            if( data.month === currentMonth ){
                console.log(`${data.month} , ${currentMonth}`);
                setAmount(data.expenseAmount);
            }
            const expenses = data.expenses;
            // Format dates before setting expenses
            const formattedExpenses = expenses.map(expense => ({
                ...expense
            }));
            setExpenses(formattedExpenses);
            setExpensesFetched(true);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
    };

    const addExpense = (newExpense, index) => {
        if( index != null ){
            const updatedExpenses = [...expenses];
            updatedExpenses[index] = newExpense;
            setExpenses(updatedExpenses);
        }
        else{
            // Format date before adding expense
            newExpense.date = newExpense.date;
            setExpenses(prevExpenses => [...prevExpenses, newExpense]); // Add new expense to expenses array
        }
    };

    // Function to format date to "mm/dd/yyyy" format
    const formatDate = (dateString) => {
        // 2024-01-01 getDate is showing 31
        const date = new Date(`${dateString}T00:00:00Z`);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Method to handle edit action
    const handleEdit = (index, updatedExpense) => {
        setSelectedExpenseIndex(index); // Set the selected index
        setExpenseData(expenses[index]);
        setIsModalOpen(true);
    };

    // Method to handle delete action
    const handleDelete = async (index) => {
        const expenseId = expenses[index]._id; // Assuming each expense has a unique ID 
        const token = localStorage.getItem('token');
        
        axios.delete(`${BASE_URL}/expenses/deleteExpense/${expenseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            
            // If the delete request is successful, update the expenses state
            const updatedExpenses = [...expenses];
            updatedExpenses.splice(index, 1);
            setExpenses(updatedExpenses);
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
        });
    };

    const handleCSVUpload = () => {
        // Create an input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
    
        // Trigger a click event on the input element
        input.click();
    
        // Add event listener for file selection
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
    
            if (file) {
                // Read the contents of the CSV file
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const csv = e.target.result;
                    // Parse CSV data
                    const parsedData = parseCSV(csv);
                    // Add multiple expenses from parsed data
                    // Use Axios to post parsed data

                    const response = await axios.post(`${BASE_URL}/expenses/addMultipleExpenses`, parsedData, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Include the token as Bearer token in the headers
                        }
                    });
                    if(response.status == 200){
                        const uploadedExpenses = response.data.expenses;
                        const transformedExpenses = uploadedExpenses.map(currentExpense => ({
                            id: currentExpense.id,
                            category: currentExpense.expense.category,
                            title: currentExpense.expense.title,
                            price: currentExpense.expense.price,
                            expectedPrice: currentExpense.expense.expectedPrice,
                            date: currentExpense.expense.date,
                            email: currentExpense.expense.email
                        }));
                        transformedExpenses.forEach(addexpense => {
                            const dateObj = new Date(addexpense.date);
                            const year = dateObj.getFullYear();
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            const formattedDate = `${year}-${month}-${day}`;
                            addexpense.date = formattedDate;
                            addexpense._id = addexpense.id;
                            setExpenses(prevExpenses => [...prevExpenses, addexpense]);
                        });
                        
                    }
                };
                reader.readAsText(file);
            }
        });
    };
    
    const parseCSV = (csv) => {
        const email = localStorage.getItem('email');
        // Split CSV into rows
        const rows = csv.split('\n');
        // Remove header row if present
        if (rows.length > 0) rows.shift();
        // Parse each row
        const expenses = [];
        let displayAlert = false;
        rows.forEach(row => {
            const columns = row.split(',');
            const category = columns[0];
            const title = columns[1];
            const price = parseFloat(columns[2]);
            const expectedPrice = parseFloat(columns[3]);
            const date = new Date(columns[4]);
            
            // Validate category
            if (!['Utilities', 'Transportation', 'Entertainment', 'Clothing', 'Other'].includes(category)) {
                console.warn(`Invalid category: ${category}. Skipping this record.`);
                return; // Skip this record
            }
            
            // Validate date
            const currentDate = new Date();
            const expenseDate = new Date(date);
            if (expenseDate > currentDate) {
                displayAlert = true;
                console.warn('Date cannot be a future date. Skipping this record.');
                return; // Skip this record
            }
    
            expenses.push({
                category,
                title,
                price,
                expectedPrice,
                date,
                email
            });
        });
        if( displayAlert ){
            alert('Few records have a date, in which purchase date is in future Or If the any input is missing. These records are skipped.');
            displayAlert = false;
        }

        return expenses;
    };
    
    
    
    const addMultipleExpenses = (expenses) => {
        // Add each expense to the expenses state
        expenses.forEach(expense => {
            // Format date before adding expense
            expense.date = expense.date;
            setExpenses(prevExpenses => [...prevExpenses, expense]);
        });
    };

    const addMonthlyExpense = (amount) => {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');

        // Call backend to renew token
        axios.post(`${BASE_URL}/expenses/addMonthlyExpenses/${userid}`,{amount}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                alert('Monthly Expense Added/Updated Successfully');
            })
            .catch(error => {
                console.error('Error renewing token:', error);
            });
    };


    return (
        <div>
            <NavBar onLogout={onLogout} role="navigation" aria-label="Main Navigation" />
            <ToastContainer />
            <div>
                These are the latest budgets that are added,<span className="navbar-item add-color" onClick={openModal}><a href="#">Want to add New Expenses? Click here.</a></span>
            </div>
            <div>
                {/* Add your monthly expenses form */}
                <MonthlyExpensesForm amount={amount} addMonthlyExpense={addMonthlyExpense} />
            </div>
            <div>
                If you want to add multiple expenses(make sure to have columns as follows category, title, price, expectedPrice, date).<span className="navbar-item add-color" onClick={handleCSVUpload}><a href="#">To Upload, Click here.</a></span>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Actual Price</th>
                            <th>Expected Price</th>
                            <th>Date</th>
                            <th>Actions</th> {/* Add a new column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={index}>
                                <td>{expense.category}</td>
                                <td>{expense.title}</td>
                                <td>${expense.price}</td>
                                <td>${expense.expectedPrice}</td>
                                <td>{expense.date}</td>
                                <td>
                                    {/* Edit icon with click handler */}
                                    <span className="action-icon" onClick={() => handleEdit(index)}>
                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                    </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {/* Delete icon with click handler */}
                                    <span className="action-icon" onClick={() => handleDelete(index)}>
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ExpenseModal isOpen={isModalOpen} onClose={closeModal} addExpense={addExpense} data={expenseData} index={selectedExpenseIndex}/>
            {tokenExpiresIn < 20000 && showTokenExpirationAlert && displayAlert &&(
                <TokenExpirationModal 
                isOpen={showTokenExpirationAlert} 
                onRenewSession={handleRenewSession} 
                onCancel={handleCancel}
                aria-labelledby="tokenExpirationTitle"
                aria-describedby="tokenExpirationDescription"
                />
            )}
        </div>
    );
}

export default Homepage;