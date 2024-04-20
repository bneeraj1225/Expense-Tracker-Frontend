import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ data }) {
    // State to store the colors for actual and expected prices
    const [actualColors, setActualColors] = useState([]);
    const [expectedColors, setExpectedColors] = useState([]);
    const [hasColor, setHasColor] = useState(false);

    // Function to generate random colors
    function generateRandomColors(count) {
        const colors = [];
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let j = 0; j < 6; j++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        for (let i = 0; i < count; i++) {
            colors.push(color);
        }
        return colors;
    }

    // Generate colors when the component mounts
    useEffect(() => {
        const categories = Object.keys(data.reduce((acc, item) => {
            acc[item.category] = true;
            return acc;
        }, {}));
        const actualColors = generateRandomColors(categories.length);
        const expectedColors = generateRandomColors(categories.length);
        setActualColors(actualColors);
        setExpectedColors(expectedColors);
    }, [data]);

    // Function to group data by category
    function groupByCategory(data) {
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.category]) {
                groupedData[item.category] = {
                    actual: 0,
                    expected: 0
                };
            }
            groupedData[item.category].actual += item.price;
            groupedData[item.category].expected += item.expectedPrice;
        });
        return groupedData;
    }

    // Grouping data by category
    const groupedData = groupByCategory(data);

    // Extracting categories and their respective actual and expected prices
    const categories = Object.keys(groupedData);
    const actualPrices = categories.map(category => groupedData[category].actual);
    const expectedPrices = categories.map(category => groupedData[category].expected);

    // Chart.js data object
    const chartData = {
        labels: categories,
        datasets: [
            {
                label: 'Actual Price',
                data: actualPrices,
                backgroundColor: actualColors,
                stack: 'stack1', // Set the stack value to the same for both datasets
            },
            {
                label: 'Expected Price',
                data: expectedPrices,
                backgroundColor: expectedColors,
                stack: 'stack1', // Set the stack value to the same for both datasets
            }
        ]
    };

    // Chart.js options object
    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: false,
            },
        },
    };

    return (
        <div aria-label="Bar Chart representing Actual vs Expected Expenditure by Category" role="img">
            <h2>Actual vs Expected Expenditure by Category</h2>
            <Bar data={chartData} options={options} data-testid='mocked-bar-chart' />
        </div>
    );
}

export default BarChart;
