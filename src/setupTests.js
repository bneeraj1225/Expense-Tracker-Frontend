// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
//import '@testing-library/jest-dom';
require('@testing-library/jest-dom')

// src/setupTests.js

// Mock getContext method of HTMLCanvasElement to prevent "Not implemented" error
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    setLineDash: jest.fn(),
    getLineDash: jest.fn(),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setPixelRatio: jest.fn(),
    drawImage: jest.fn(),
    createLinearGradient: jest.fn(),
    createPattern: jest.fn(),
    createRadialGradient: jest.fn(),
    drawFocusIfNeeded: jest.fn(),
    ellipse: jest.fn(),
    getContextAttributes: jest.fn(),
    setContextAttributes: jest.fn(),
    lineDashOffset: jest.fn(),
}));

