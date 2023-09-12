import React from 'react';
import { __ } from '../../../../utilities/helpers.jsx';

export function Applied({ error_message }) {
    return (
        <div>
            {!error_message ? (
                <div>
                    <strong>{__('Success')}</strong>
                    {__('Application has been submitted!')}
                </div>
            ) : (
                <div>{error_message}</div>
            )}
        </div>
    );
}
