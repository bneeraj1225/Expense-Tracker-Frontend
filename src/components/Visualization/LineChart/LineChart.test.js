// LineChart.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import LineChart from './LineChart';

jest.mock('react-chartjs-2', () => ({
    Line: () => <canvas data-testid="mocked-line-chart" />,
  }));

describe('LineChart', () => {
    test('renders line chart with correct data', () => {
        const data = [
            { category: 'Category 1', price: 50 },
            { category: 'Category 2', price: 30 },
            { category: 'Category 3', price: 70 }
        ];

        const { getByTestId } = render(<LineChart data={data} />);
        
        const barChart = getByTestId('mocked-line-chart');
        expect(barChart).toBeInTheDocument();

        // Add more specific assertions as needed
    });

    // Add more tests as needed to validate the behavior of the LineChart component
});
