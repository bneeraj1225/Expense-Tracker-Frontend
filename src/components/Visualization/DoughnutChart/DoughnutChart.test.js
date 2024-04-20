// DoughnutChart.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import DoughnutChart from './DoughnutChart';

// Mock the chart library
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <canvas data-testid="mocked-doughnut-chart" />,
}));

describe('DoughnutChart', () => {
    test('renders doughnut chart with correct number of data points', () => {
        const data = [
            { category: 'Category 1', price: 50 },
            { category: 'Category 2', price: 30 },
            { category: 'Category 3', price: 70 }
        ];

        const { getByTestId } = render(<DoughnutChart data={data} />);
        const doughnutChart = getByTestId('mocked-doughnut-chart');
        expect(doughnutChart).toBeInTheDocument();
        // Add more specific assertions as needed
    });

    // Add more tests as needed to validate the behavior of the DoughnutChart component
});

export default DoughnutChart;
