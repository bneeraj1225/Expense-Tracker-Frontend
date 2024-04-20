// DoughnutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

function DoughnutChart({ data }) {
    // Extracting labels and data values
    const labels = data.map(item => item.category);
    const values = data.map(item => item.price);

    // Creating dataset
    const dataset = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(231, 233, 237)',
            'rgb(255, 0, 0)'
                ]
            }
        ]
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end' // Aligning legend items to the end
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return label + ': $' + value.toFixed(2);
                    }
                }
            }
        }
    };

    return (
        <div role="img" aria-label="Doughnut Chart">
            <h2>Doughnut Chart</h2>
            <Doughnut data-testid="mocked-doughnut-chart" data={dataset} options={options} />
        </div>
    );
}

export default DoughnutChart;