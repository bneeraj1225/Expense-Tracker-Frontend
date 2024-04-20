// TokenExpirationModal.js

import React from 'react';
import './TokenExpirationModal.css';

const TokenExpirationModal = ({ isOpen, onRenewSession, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="token-expiration-modal-background" role="dialog" aria-labelledby="token-expiration-modal-heading" aria-describedby="token-expiration-modal-description">
            <div className="token-expiration-modal-content">
                <p id="token-expiration-modal-description">Your session will expire in less than 20 seconds. Do you want to renew your session?</p>
                <button onClick={onRenewSession}>Renew Session</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default TokenExpirationModal;