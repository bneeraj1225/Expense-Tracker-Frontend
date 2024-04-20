import React from 'react';
import { render } from '@testing-library/react';
import SpeedometerChart from './SpeedometerChart';

describe('SpeedometerChart', () => {
    test('renders with correct total amount spent', () => {
        const testData = [
            { price: 100 },
            { price: 200 },
            { price: 300 }
        ];

        const { getByText } = render(
            <SpeedometerChart data={testData} />
        );

        // Verify that the total amount spent is rendered correctly
        expect(getByText('Total amount spent : 600')).toBeInTheDocument();
    });

    test('renders with correct total amount spent when data is empty', () => {
        const testData = [];

        const { getByText } = render(
            <SpeedometerChart data={testData} />
        );

        // Verify that the total amount spent is rendered correctly as 0
        expect(getByText('Total amount spent : 0')).toBeInTheDocument();
    });
});
