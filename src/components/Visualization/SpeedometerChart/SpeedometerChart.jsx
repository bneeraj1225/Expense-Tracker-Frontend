import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

const SpeedometerChart = ({ data, totalSpentPerMonth, totalSpentPerYear }) => {
    let value = 0;
    data.forEach(item => {
        value += item.price;
    });
    

    // Set the maximum value to be 20% higher than the total price
    let maxValue = value * 1.2;

    return (
        <div role="region" aria-label="Speedometer Chart">
            <h2>Speedometer Chart</h2>
            <ReactSpeedometer
                value={value}
                minValue={0}
                maxValue={maxValue}
                needleColor="steelblue"
                startColor="green"
                endColor="red"
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-valuenow={value}            />
            <div>Total amount spent : {value}</div>
            <div>Total amount spent for this month : {totalSpentPerMonth}</div>
            <div>Total amount spent for this year: {totalSpentPerYear}</div>
        </div>
    );
};

export default SpeedometerChart;
