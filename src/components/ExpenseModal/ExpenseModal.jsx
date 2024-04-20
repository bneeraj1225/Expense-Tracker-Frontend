import React, { useEffect, useState } from 'react';
import './ExpenseModal.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../App';


// 'Pharmacy', 'Clothing', 'Entertainment', 'Groceries'
// Expected budget: A, Used: B
// Two types:
// Expense category, title, value
// Month, Expected, Used in each category
// 3 accessibility

const categories = ['Select category','Groceries', 'Utilities', 'Transportation', 'Entertainment', 'Clothing', 'Other'];

const ExpenseModal = ({ isOpen, onClose, addExpense, data, index }) => {
    const [changed, setChanged] = useState(false);
    const [documentId, setDocumentId] = useState(''); // Add state for documentId
    const [expenseTitle, setExpenseTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [date, setDate] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const expensePostURL = `${BASE_URL}/expenses/addExpenses`;
    const expensePutURL = `${BASE_URL}/expenses/updateExpense`;
    const handleExpenseChange = (event) => {
        setExpenseTitle(event.target.value);
    };

    // Function to format date to "yyyy-MM-dd" format
    const formatDate = (dateString, flag) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
        let day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
        if( flag ){
            return `${year}-${month}-${day}`;
        }
        day = parseInt(day) + 1;
        return `${month}/${day}/${year}`;
    };


    useEffect(() => {
        if( data ) {
            setExpenseTitle(data.title);
            setCategory(data.category);
            setPrice(data.price);
            setDate(data.date,true);
            setDocumentId(data._id);
            setExpectedPrice(data.expectedPrice);
        }
    }, [data])

    const handleCategoryChange = (event) => {
        setChanged(true);
        setCategory(event.target.value);
        if (event.target.value !== 'other') {
            setCustomCategory(''); // Reset custom category when other is not selected
        }
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleExpectedPriceChange = (event) => {
        setExpectedPrice(event.target.value);
    }

    const handleCustomCategoryChange = (event) => {
        setCustomCategory(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            expenseTitle,
            category: category !== 'other' ? category : customCategory,
            price: price,
            date,
            documentId,
            expectedPrice: expectedPrice
        };
        const token = localStorage.getItem('token');
        data.email = localStorage.getItem('email');
        try {
            if( documentId ) {
                const response = await axios.put( `${expensePutURL}/${documentId}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token as Bearer token in the headers
                    }
                });
                if (response.status === 200 && response.data.success) {
                    const expense = {
                        category: data.category,
                        title: data.expenseTitle,
                        price: data.price,
                        date: data.date,
                        _id: response.data._id,
                        expectedPrice: data.expectedPrice
                    };
                    addExpense(expense, index);
                    // Show success toast message
                    toast.success("Expense updated successfully!");
                }
            } else {
                const response = await axios.post(expensePostURL, data, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token as Bearer token in the headers
                    }
                });
                if (response.status === 200 && response.data.success) {
                    const expense = {
                        category: data.category,
                        title: data.expenseTitle,
                        price: data.price,
                        date: data.date,
                        _id: response.data._id,
                        expectedPrice: data.expectedPrice
                    };
                    addExpense(expense, null);
                    // Show success toast message
                    toast.success("Expense added successfully!");
                }
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            // Show error toast message
            toast.error("Failed to add expense!");
        }

        // Reset form inputs and close the modal
        setExpenseTitle('');
        setCategory('');
        setCustomCategory('');
        setPrice('');
        setExpectedPrice('');
        setDate('')
        onClose();
    };

    function getTodayDate() {
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();
    
        if (dd < 10) {
            dd = '0' + dd;
        }
    
        if (mm < 10) {
            mm = '0' + mm;
        }
    
        return yyyy + '-' + mm + '-' + dd;
    }
    

    return (
        <div className={isOpen ? 'modal-overlay open' : 'modal-overlay'} onClick={onClose} role="dialog"
        aria-modal="true"
        aria-labelledby="expenseModalTitle">
            <div className="modal" onClick={(e) => e.stopPropagation()} role="document">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{data ? 'Edit Expense' : 'Add Expense'}</h2> {/* Change modal title based on whether data is provided */}
                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="documentId" value={data ? data._id : ''} aria-hidden="true" /> {/* Hidden input field for _id */}
                    <div className="input-group">
                        <select data-testid="categorySelect" value={category} onChange={handleCategoryChange}>
                        {categories.map((item, index) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                        </select>
                        {changed && category === 'Select category' && (
                        <span className='category-select'> Please select a category from the dropdown</span>
                        )}
                    </div>
    
                    {/* Display custom category input only when 'other' is selected */}
                    {category === 'other' && (
                        <input
                        type="text"
                        value={customCategory}
                        onChange={handleCustomCategoryChange}
                        placeholder="Enter custom category..."
                        className="input-custom-category"
                        />
                    )}
    
                    <input type="text" value={expenseTitle} onChange={handleExpenseChange} required placeholder="Enter expense title..." />
                    <input type="number" value={price} onChange={handlePriceChange} required placeholder="Enter expected price..." />
                    <input type="number" value={expectedPrice} onChange={handleExpectedPriceChange} required placeholder="Enter actual price..." />
                   <div className="input-group">
                        <label htmlFor="expenseDate">Expense Purchase Date:</label>
                        <input type="date" max={getTodayDate()} id="expenseDate" value={date} onChange={handleDateChange} required className="modal-input" />
                    </div>
                    <button type="submit" aria-label={data && data.title ? 'Update' : 'Add'} >{data && data.title ? 'Update' : 'Add'}</button> {/* Change button text based on whether data is provided */}
                </form>
            </div>
        </div>
    );
    
};

export default ExpenseModal;