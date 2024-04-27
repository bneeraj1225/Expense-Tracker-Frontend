import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function MonthlyBarChart({ month, amount, data }) {
    const [usedAmount, setUsedAmount] = useState(0);
    const [expectedAmount, setExpenseAmount] = useState(0);
    const [months,setMonths] = useState({1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'});
    const [currentMonth,setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear ,setCurrentYear] = useState(new Date().getFullYear());
    

    useEffect(() => {
        let total = 0;
        data.forEach((item) => {
            const itemDate = new Date(item.date);
            if( (itemDate.getMonth() + 1) === month && itemDate.getFullYear() === currentYear){
                total += parseFloat(item.price);
            }
        });

        setUsedAmount(total);
        if(amount !== null){
            setExpenseAmount(amount);
        }
    }, [data, amount]); // Added dependency array to trigger effect on data or amount change

    // Chart data
    const chartData = {
        labels: ['Expected Amount', 'Used Amount'],
        datasets: [
            {
                label: 'Expense',
                backgroundColor: ['#007bff', '#28a745'],
                borderColor: ['#007bff', '#28a745'],
                borderWidth: 1,
                hoverBackgroundColor: ['#0056b3', '#218838'],
                hoverBorderColor: ['#0056b3', '#218838'],
                data: [expectedAmount, usedAmount],
            },
        ],
    };

    // Chart options
    const chartOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    return (
        <div>
            {(amount === null || month === -1) ? (
                <h2 style={{paddingBottom:'25vh'}}>Submit your expected monthly expenses to view this chart</h2>
            ) : (
                <div>
                    <h2> Used Amount vs Expected Amount for {months[month]} </h2>
                    <h2>Expected vs Actual Expense Amount</h2>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
}

export default MonthlyBarChart;
