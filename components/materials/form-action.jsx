import React from 'react';
import { __ } from '../utilities/helpers.jsx';

export function FormActionButtons(props) {
    const { onBack, onNext, backText = __('Back'), nextText = __('Next') } = props;

    return (
        <div className={'d-flex column-gap-40 margin-bottom-30'.classNames()}>
            {(onBack && (
                <div style={{ width: '138px' }}>
                    <button
                        className={'d-inline-block button button-primary button-outlined button-outlined-secondary button-full-width'.classNames()}
                        onClick={onBack}
                    >
                        {backText}
                    </button>
                </div>
            )) ||
                null}

            {(onNext && (
                <div className={'flex-1'.classNames()}>
                    <button
                        className={'button button-primary button-full-width'.classNames()}
                        onClick={onNext}
                    >
                        {nextText}
                    </button>
                </div>
            )) ||
                null}
        </div>
    );
}
