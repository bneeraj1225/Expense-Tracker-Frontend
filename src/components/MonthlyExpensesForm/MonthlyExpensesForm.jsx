import React, { useEffect, useState } from 'react';
import './MonthlyExpensesForm.css'; // Assuming you have a CSS file for styles

function MonthlyExpensesForm({ amount, addMonthlyExpense }) {
    console.log(`Amount: ${amount}`)
    const [expenseAmount, setExpenseAmount] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add validation if needed
        console.log(`expenseAmount: ${expenseAmount}`);
        addMonthlyExpense(parseFloat(expenseAmount)); // Convert to float and pass to the addMonthlyExpense function
    };

    useEffect(() => {
        if (amount !== null) {
            setExpenseAmount(amount); // Convert amount to string and set as expenseAmount
        }
    }, [amount]);

    return (
        <div className="monthly-expenses-form-container">
            <form className="monthly-expenses-form" onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter expected monthly expense"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />
                {
                    amount === null ?
                    <button type="submit">Submit Expense</button>:
                    <button type="submit">Update Expense</button>
                }
            </form>
        </div>
    );
}

export default MonthlyExpensesForm;
