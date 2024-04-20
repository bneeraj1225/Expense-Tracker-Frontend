import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TokenExpirationModal from './TokenExpirationModal';

describe('TokenExpirationModal', () => {
    test('renders with correct message and buttons when isOpen is true', () => {
        const onRenewSession = jest.fn();
        const onCancel = jest.fn();

        const { getByText } = render(
            <TokenExpirationModal isOpen={true} onRenewSession={onRenewSession} onCancel={onCancel} />
        );

        // Verify that the modal message is rendered
        expect(getByText(/Your session will expire/)).toBeInTheDocument();

        // Verify that the Renew Session button is rendered
        const renewButton = getByText('Renew Session');
        expect(renewButton).toBeInTheDocument();

        // Verify that the Cancel button is rendered
        const cancelButton = getByText('Cancel');
        expect(cancelButton).toBeInTheDocument();

        // Simulate a click on the Renew Session button and verify if the corresponding function is called
        fireEvent.click(renewButton);
        expect(onRenewSession).toHaveBeenCalled();

        // Simulate a click on the Cancel button and verify if the corresponding function is called
        fireEvent.click(cancelButton);
        expect(onCancel).toHaveBeenCalled();
    });

    test('does not render when isOpen is false', () => {
        const onRenewSession = jest.fn();
        const onCancel = jest.fn();

        const { queryByText } = render(
            <TokenExpirationModal isOpen={false} onRenewSession={onRenewSession} onCancel={onCancel} />
        );

        // Verify that the modal content is not rendered when isOpen is false
        expect(queryByText(/Your session will expire/)).not.toBeInTheDocument();
    });
});
