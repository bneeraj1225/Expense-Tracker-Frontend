import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './PieChart.css'; // Import CSS file for styling

const PieChart = ({ expenses }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (expenses.length > 0) {
            renderPieChart();
        }
    }, [expenses]);

    const renderPieChart = () => {
        const categories = expenses.map(expense => expense.category);
        const prices = expenses.map(expense => expense.price);
        const expectedPrices = expenses.map(expense => expense.expectedPrice);

        const data = {
            labels: categories,
            datasets: [
                {
                    label: 'Price',
                    data: prices,
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)',
                        'rgb(231, 233, 237)',
                        'rgb(255, 0, 0)'
                    ],
                },
            ],
        };

        const expectedData = {
            labels: categories,
            datasets: [
                {
                    label: 'Expected Price',
                    data: expectedPrices,
                    backgroundColor: [
                        'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(231, 233, 237)',
            'rgb(255, 0, 0)'
                    ],
                },
            ],
        };

        setChartData({ data, expectedData });
    };

    return (
        <div className="pie-chart-container" role="group" aria-label="Pie Charts">
            <div className="pie-chart">
                <h2>Pie Chart - Actual Price</h2>
                {chartData && <Pie data={chartData.data} data-testid='mock-pie-chart1' aria-label="Actual Price Pie Chart"/>}
            </div>
            <div className="pie-chart">
                <h2>Pie Chart - Expected Price</h2>
                {chartData && <Pie data={chartData.expectedData} data-testid='mock-pie-chart2' aria-label="Expected Price Pie Chart"/>}
            </div>
        </div>
    );
};

export default PieChart;
