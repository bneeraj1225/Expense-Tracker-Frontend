import React from 'react';
import { render } from '@testing-library/react';
import PieChart from './PieChart';

// Mock the chart library
jest.mock('react-chartjs-2', () => ({
    Pie: () => (
        <div>
            <canvas data-testid="mock-pie-chart1" />
            <canvas data-testid="mock-pie-chart2" />
        </div>
    )
}));


describe('PieChart', () => {
    test('renders without crashing', () => {
        const { getByText } = render(<PieChart expenses={[]} />);
        const chartTitle = getByText('Pie Chart - Actual Price');
        expect(chartTitle).toBeInTheDocument();
    });

    test('renders both actual price and expected price charts', () => {
        const expenses = [
            { category: 'Food', price: 50, expectedPrice: 40 },
            { category: 'Transportation', price: 30, expectedPrice: 35 },
            { category: 'Entertainment', price: 20, expectedPrice: 25 },
        ];

        const { getByText } = render(<PieChart expenses={expenses} />);
        
        // Check if both actual and expected price chart titles are present
        const actualPriceChartTitle = getByText('Pie Chart - Actual Price');
        const expectedPriceChartTitle = getByText('Pie Chart - Expected Price');
        expect(actualPriceChartTitle).toBeInTheDocument();
        expect(expectedPriceChartTitle).toBeInTheDocument();

        // Check if both actual and expected price charts are rendered
        const actualPriceChart = document.querySelector('[data-testid="mock-pie-chart1"]');
        const expectedPriceChart = document.querySelector('[data-testid="mock-pie-chart2"]');
        expect(actualPriceChart).toBeInTheDocument();
        expect(expectedPriceChart).toBeInTheDocument();
    });
});
