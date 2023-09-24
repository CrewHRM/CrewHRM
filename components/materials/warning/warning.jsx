import React, { createContext, useState } from 'react';

import style from './warning.module.scss';
import { __ } from '../../utilities/helpers.jsx';
import { LoadingIcon } from '../loading-icon/loading-icon.jsx';
import { Modal } from '../modal.jsx';
import { Conditional } from '../conditional.jsx';

export const ContextWarning = createContext();

const btn_class =
    'font-size-15 font-weight-400 letter-spacing--3 padding-vertical-10 padding-horizontal-15 border-radius-5 border-1-5 b-color-tertiary cursor-pointer'.classNames();

function Warning({
    onCancel,
    onConfirm,
    confirmText,
    closeText,
    loading = false,
    message = __('Are you sure to proceed?')
}) {
    return (
        <div
            className={
                'confirm'.classNames(style) +
                'padding-vertical-40 padding-horizontal-50 text-align-center'.classNames()
            }
        >
            <span
                className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text margin-bottom-30'.classNames()}
            >
                {message}
            </span>
            <button
                className={
                    'cancel-button'.classNames(style) + btn_class + 'margin-right-20'.classNames()
                }
                onClick={() => onCancel()}
            >
                {closeText}
            </button>
            <button
                disabled={loading}
                className={'delete-button'.classNames(style) + btn_class}
                onClick={() => onConfirm()}
            >
                {confirmText}{' '}
                <Conditional show={loading}>
                    <LoadingIcon size={18} color={window.CrewHRM.colors.white} />
                </Conditional>
            </button>
        </div>
    );
}

export function WarningWrapper({ children }) {
    const [state, setState] = useState({
        message: null,
        onConfirm: () => {},
        onClose: () => {},
        confirmText: null,
        closeText: null
    });

    const [loading, setLoading] = useState(false);

    const showWarning = (
        message,
        onConfirm,
        onClose,
        confirmText = __('OK'),
        closeText = __('Cancel')
    ) => {
        setState({
            ...state,
            message,
            onConfirm,
            onClose,
            confirmText,
            closeText
        });
    };

    const closeWarning = () => {
        if (state.onClose) {
            state.onClose();
        }

        setState({
            ...state,
            message: null,
            loading: false
        });

        setLoading(false);
    };

    const loadingState = (loading = true) => {
        setLoading(loading);
    };

    return (
        <ContextWarning.Provider value={{ showWarning, closeWarning, loadingState }}>
            {state.message ? (
                <Modal>
                    <Warning
                        message={state.message}
                        loading={loading}
                        onCancel={closeWarning}
                        onConfirm={state.onConfirm || (() => {})}
                        confirmText={state.confirmText}
                        closeText={state.closeText}
                    />
                </Modal>
            ) : null}
            {children}
        </ContextWarning.Provider>
    );
}
