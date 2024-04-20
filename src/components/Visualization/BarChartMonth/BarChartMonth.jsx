import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';

function groupByMonthAndCategory(data) {
    const groupedData = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    data.forEach(item => {
        const date = new Date(item.date);
        if (date.getFullYear() === currentYear) {
            const monthYear = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
            if (!groupedData[monthYear]) {
                groupedData[monthYear] = {};
            }
            if (!groupedData[monthYear][item.category]) {
                groupedData[monthYear][item.category] = 0;
            }
            groupedData[monthYear][item.category] += item.price;
        }
    });
    return { groupedData, currentYear }; // Return currentYear along with groupedData
}

function BarChartMonth({ data }) {
    const isFirstRender = useRef(true);
    const colorsRef = useRef([]);

    // Generate colors only on the first render
    if (isFirstRender.current) {
        colorsRef.current = Array.from({ length: Object.keys(data).length }, getRandomColor);
        isFirstRender.current = false;
    }

    // Group data by month and category and get currentYear
    const { groupedData, currentYear } = groupByMonthAndCategory(data);

    // Extract unique categories
    const allCategories = Object.keys(groupedData).reduce((categories, month) => {
        const monthCategories = Object.keys(groupedData[month]);
        return [...categories, ...monthCategories];
    }, []);

    const uniqueCategories = [...new Set(allCategories)];

    // Creating datasets for each category
    const datasets = uniqueCategories.map((category, index) => {
        const dataByCategory = Object.keys(groupedData).map(month => groupedData[month][category] || 0);
        return {
            label: category,
            data: dataByCategory,
            backgroundColor: colorsRef.current[index], // Use pre-generated colors
        };
    });

    // Chart.js data object
    const chartData = {
        labels: Object.keys(groupedData),
        datasets: datasets,
    };

    // Chart.js options object
    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    return (
        <div role="img" aria-label={`Monthly Expenditure by Category for ${currentYear ? currentYear : ''}`}>
            <h2>Monthly Expenditure by Category for {currentYear ? currentYear : ''}</h2>
            <Bar data={chartData} options={options} data-testid="mocked-bar-chart-month" />
        </div>
    );
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default BarChartMonth;
