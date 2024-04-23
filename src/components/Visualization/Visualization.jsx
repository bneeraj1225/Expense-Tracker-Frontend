import React, { useEffect, useState } from 'react';
import BarChart from './BarChart/BarChart';
import PieChart from './PieChart/PieChart';
import DoughnutChart from './DoughnutChart/DoughnutChart';
import LineChart from './LineChart/LineChart';
import './Visualization.css'; // Import your CSS file
import Chart from 'chart.js/auto';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import TokenExpirationModal from '../TokenExpirationModal/TokenExpirationModal';
import axios from 'axios';
import BarChartMonth from './BarChartMonth/BarChartMonth';
import SpeedometerChart from './SpeedometerChart/SpeedometerChart';
import { BASE_URL } from '../../App';
import MonthlyBarChart from './MonthlyBarChart/MonthlyBarChart';

function Visualization({onLogout}) {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [expensesForLineChart, setExpensesForLineChart] = useState([]);
    const [totalSpentPerMonth, setTotalSpentPerMonth] = useState(0);
    const [totalSpentPerYear, setTotalSpentPerYear] = useState(0);
    const [expenseData, setExpenseData] = useState([]);
    const [tokenExpiresIn, setTokenExpiresIn] = useState(60000);
    const [showTokenExpirationAlert, setShowTokenExpirationAlert] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(true);
    const [token, setToken] = useState(null);
    const [month, setMonth] = useState(-1);
    const [monthlyExpense, setMonthlyExpense] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchExpenses(token);
            setToken(token);
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
    }, [token]);

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

    const fetchExpenses = (token) => {
        const email = localStorage.getItem('email');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0, so add 1

    fetch(`${BASE_URL}/expenses/fetchExpensesformonth/email=${email}`, {
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
            console.log(data.success);
            if (!data.success) {
                return;
            }
            console.log(data);
            setExpenses([]);
            setExpensesForLineChart([]);
            const categoryExpenses = {}, categoryExpectedExpenses = {};
            setExpenseData(data.expenses);
            setMonth(data.month);
            setMonthlyExpense(data.amount);
            let expensePerMonth = 0, expensePerYear = 0;
            let expenses = data.expenses;
            expenses.forEach(expense => {
                if (categoryExpenses[expense.category]) {
                    categoryExpenses[expense.category] += expense.price;
                    categoryExpectedExpenses[expense.category] += expense.expectedPrice;
                } else {
                    categoryExpenses[expense.category] = expense.price;
                    categoryExpectedExpenses[expense.category] = expense.expectedPrice;
                }

                // Calculate total spent per month and year
                const expenseDate = new Date(expense.date);
                if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() + 1 === currentMonth) {
                    expensePerMonth += expense.price;
                }
                if (expenseDate.getFullYear() === currentYear) {
                    expensePerYear += expense.price;
                }
            });

            const dataArray = Object.entries(categoryExpenses).map(([category, price]) => ({
                category,
                price
            }));
            
            const dataArrayForLineChart = [];
            for (let category in categoryExpenses) {
                dataArrayForLineChart.push({
                    category: category,
                    price: categoryExpenses[category],
                    expectedPrice: categoryExpectedExpenses[category]
                });
            }
            setExpenses(dataArray); // Assuming data is an array of expenses from backend
            setExpensesForLineChart(dataArrayForLineChart);
            setTotalSpentPerMonth(expensePerMonth);
            setTotalSpentPerYear(expensePerYear);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
    }

    return (
        <div>
            <NavBar onLogout={onLogout}/>
            {
                expenses.length > 0 ?
                (
                    <div className="visualization-container">
                        <div aria-label='Bar Chart Month' role='region'>
                            <MonthlyBarChart month={month} amount={monthlyExpense} data={expenseData}/>
                        </div>
                        <div aria-label="Speedometer Chart" role="region">
                            <SpeedometerChart data={expenses} totalSpentPerMonth={totalSpentPerMonth} totalSpentPerYear={totalSpentPerYear} />
                        </div>
                        <div aria-label="Pie Chart" role="region">
                        <PieChart expenses={expensesForLineChart} />
                        </div>
                        <div aria-label="Bar Chart" role="region">
                            <BarChart data={expensesForLineChart} />
                        </div>
                        <div aria-label="Doughnut Chart" role="region">
                            <DoughnutChart data={expenses} />
                        </div>
                        <div aria-label="Line Chart" role="region">
                            <LineChart data={expensesForLineChart} />
                        </div>
                        <div aria-label="Bar Chart Month" role="region">
                            <BarChartMonth data={expenseData} />
                        </div>
                </div>
                ) : <h2> There is no data for visualization</h2>}
                {tokenExpiresIn < 20000 && showTokenExpirationAlert && displayAlert &&(
                    <TokenExpirationModal 
                    isOpen={showTokenExpirationAlert} 
                    onRenewSession={handleRenewSession} 
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}

export default Visualization;