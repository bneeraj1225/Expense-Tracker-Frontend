import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarChart from './BarChart';

// Mock the chart library
jest.mock('react-chartjs-2', () => ({
    Bar: () => <canvas data-testid="mocked-bar-chart" />,
  }));

  describe('BarChart', () => {
    test('renders without crashing', () => {
        const { getByText } = render(<BarChart data={[]} />);
        const chartTitle = getByText('Actual vs Expected Expenditure by Category');
        expect(chartTitle).toBeInTheDocument();
    });  
});