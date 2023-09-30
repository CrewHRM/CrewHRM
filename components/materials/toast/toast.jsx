import React, { createContext, useEffect, useRef, useState } from 'react';

import { __, getRandomString } from '../../utilities/helpers.jsx';
import style from './toast.module.scss';
import { Ripple } from '../dynamic-svg/ripple.jsx';

export const ContextToast = createContext();

const colors = {
    success: window.CrewHRM.colors['secondary'],
    warning: window.CrewHRM.colors['warning'],
    error: window.CrewHRM.colors['error']
};

export function ToastWrapper({children}) {
    const ref = useRef();

    const [state, setState] = useState({
        mouse_over: false,
        toasts: []
    });

    const registerCloser = (id) => {
        setTimeout(() => {
            if (!state.mouse_over) {
                dismissToast(id);
            } else {
                registerCloser(id);
            }
        }, 5000);
    };

    const addToast = (toast) => {
        const new_id = getRandomString();
        const { toasts = [] } = state;

        if (typeof toast === 'string') {
            toast = {
                message: toast,
                dismissible: true
            };
        }

        // Push new toast in the arra
        toasts.push({
            ...toast,
            id: new_id
        });

        // Update state with the toasts
        setState({
            ...state,
            toasts
        });

        // Register closer to close it after certain times
        registerCloser(new_id);
    };

    const ajaxToast = (response) => {
        const { success, data } = typeof response === 'object' ? response || {} : {};
        const { message = __('Something went wrong!'), status } = data || {};

        addToast({
            message,
            dismissible: true,
            status: status || (success ? 'success' : 'error')
        });
    };

    const dismissToast = (id) => {
        const { toasts = [] } = state;
        const index = toasts.findIndex((t) => t.id === id);
        toasts.splice(index, 1);
        setState({
            ...state,
            toasts
        });
    };

    const setMouseState = (over) => {
        setState({
            ...state,
            mouse_over: over
        });
    };

    // Scroll to last to show latest one
    useEffect(() => {
        if (!state.toasts.length || !ref?.current) {
            return;
        }
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [state.toasts.length]);

    return (
        <ContextToast.Provider value={{ addToast, ajaxToast }}>
            {children}

            {(state.toasts.length && (
                <div
                    data-crewhrm-selector="toast-wrapper"
                    ref={ref}
                    className={
                        'toast'.classNames(style) + 'position-fixed right-50 bottom-33'.classNames()
                    }
                    onMouseOver={() => setMouseState(true)}
                    onMouseOut={() => setMouseState(false)}
                >
                    {state.toasts.map((toast) => {
                        const { id, message, dismissible, onTryAgain, status = 'success' } = toast;

                        return (
                            <div
                                data-crewhrm-selector="toast-single"
                                key={id}
                                className={'d-flex align-items-center border-radius-5'.classNames()}
                            >
                                <div
                                    data-crewhrm-selector="content"
                                    className={'flex-1 d-flex align-items-center row-gap-10 padding-15'.classNames()}
                                >
                                    <div
                                        data-crewhrm-selector="ripple"
                                        className={'d-inline-block'.classNames()}
                                    >
                                        <Ripple color={colors[status] || colors['success']} />
                                    </div>
                                    <span
                                        data-crewhrm-selector="message"
                                        className={'d-inline-block margin-left-10 font-size-15 font-weight-500 line-height-18 color-white'.classNames()}
                                    >
                                        {message}
                                    </span>
                                </div>
                                {((dismissible || onTryAgain) && (
                                    <div
                                        data-crewhrm-selector="control"
                                        className={'d-flex flex-direction-column border-left-1'.classNames()}
                                    >
                                        {(onTryAgain && (
                                            <div
                                                data-crewhrm-selector="try"
                                                className={`padding-vertical-10 padding-horizontal-20 ${
                                                    dismissible ? 'border-bottom-1' : ''
                                                }`.classNames()}
                                            >
                                                <span
                                                    className={'font-size-13 font-weight-500 line-height-22 color-white cursor-pointer'.classNames()}
                                                    onClick={() => {
                                                        dismissToast(id);
                                                        onTryAgain();
                                                    }}
                                                >
                                                    {__('Try Again')}
                                                </span>
                                            </div>
                                        )) ||
                                            null}
                                        {(dismissible && (
                                            <div
                                                data-crewhrm-selector="dismiss"
                                                className={'padding-vertical-10 padding-horizontal-20'.classNames()}
                                            >
                                                <span
                                                    className={'font-size-13 font-weight-500 line-height-22 color-white cursor-pointer'.classNames()}
                                                    onClick={() => dismissToast(id)}
                                                >
                                                    {__('Dismiss')}
                                                </span>
                                            </div>
                                        )) ||
                                            null}
                                    </div>
                                )) ||
                                    null}
                            </div>
                        );
                    })}
                </div>
            )) ||
                null}
        </ContextToast.Provider>
    );
}
