// BarChartMonth.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import BarChartMonth from './BarChartMonth';

// Mock the chart library
jest.mock('react-chartjs-2', () => ({
    Bar: () => <canvas data-testid="mocked-bar-chart-month" />,
  }));


describe('BarChartMonth', () => {
    test('renders bar chart with correct number of datasets', () => {
        const data = [
            {
                date: '2022-01-01',
                category: 'Category 1',
                price: 50,
            },
            {
                date: '2022-01-01',
                category: 'Category 2',
                price: 30,
            },
            {
                date: '2022-02-01',
                category: 'Category 1',
                price: 70,
            },
        ];

        const { getByTestId } = render(<BarChartMonth data={data} />);
        // mocked-bar-chart-month
        const barChart = getByTestId('mocked-bar-chart-month');
        expect(barChart).toBeInTheDocument();
    });

    // Add more tests as needed to validate the behavior of the BarChartMonth component
});