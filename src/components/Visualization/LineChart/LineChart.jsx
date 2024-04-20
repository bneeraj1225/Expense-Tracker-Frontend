import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function LineChart({ data }) {
    // Extracting labels, actual prices, and expected prices
    const labels = data.map(item => item.category);
    const actualPrices = data.map(item => item.price);
    const expectedPrices = data.map(item => item.expectedPrice);

    // Initialize colors state
    const [colors, setColors] = useState([]);

    // Generate random colors when component mounts
    useEffect(() => {
        const randomColors = labels.map(() => getRandomColor());
        if(colors.length === 0)
            setColors(randomColors);
    }, [labels]);

    // Creating datasets
    const datasets = [
        {
            label: 'Actual Price',
            data: actualPrices,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            pointBackgroundColor: colors, // Use the generated colors for points
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.1
        },
        {
            label: 'Expected Price',
            data: expectedPrices,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.1
        }
    ];

    // Custom legend labels
    const legendLabels = labels.flatMap((label, index) => ([
        {
            text: `${label} (Actual)`, // Example: "Food (Actual)"
            fillStyle: colors[index],
        },
        {
            text: `${label} (Expected)`, // Example: "Food (Expected)"
            fillStyle: 'rgb(255, 99, 132)', // Use a fixed color for expected price
        }
    ]));

    // Chart.js options for legend customization
    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    generateLabels: function(chart) {
                        return legendLabels.map(label => ({
                            text: label.text,
                            fillStyle: label.fillStyle,
                            strokeStyle: label.strokeStyle,
                            lineWidth: label.lineWidth,
                            hidden: label.hidden,
                            index: label.index,
                            datasetIndex: label.datasetIndex
                        }));
                    }
                },
                onClick: null, // Disable click event handling
                onHover: null // Disable hover event handling
            }
        }
    };

    const dataset = { labels: labels, datasets: datasets };

    return (
        <div tabIndex="0" role="img" aria-label="Line Chart">
            <h2>Line Chart</h2>
            <Line data={dataset} options={options} data-testid="mocked-line-chart"/>
        </div>
    );
}

export default LineChart;
