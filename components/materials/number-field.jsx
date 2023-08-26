import React, { useRef, useState } from 'react';

export function NumberField(props) {
    const { onChange, className = '', value, max, min } = props;
    const ref = useRef();
    const [state, setState] = useState({
        focused: false
    });

    const changeValue = (shift, val) => {
        // Focu the field to apply styles
        ref.current.focus();

        // Collect value and dispatch
        let value = parseInt(val === undefined ? ref?.current?.value : val) || 0;

        // Apply controller action
        if (shift === 1 || shift === -1) {
            value = value + shift;
        }

        // Apply validation
        if (!isNaN(min) && value < min) {
            value = min;
        }
        if (!isNaN(max) && value > max) {
            value = max;
        }

        // Dispatch to parent level caller
        onChange(value);
    };

    const toggleFocusState = (focused) => {
        setState({
            ...state,
            focused
        });
    };

    const controller_class = `font-size-20 cursor-pointer ${
        state.focused ? 'color-primary' : 'color-text-light'
    }`.classNames();

    return (
        <div
            data-crewhrm-selector="number-field"
            className={
                `d-flex align-items-center ${state.focused ? 'focused' : ''}`.classNames() +
                className
            }
        >
            <div className={'height-20'.classNames()}>
                <i
                    className={'ch-icon ch-icon-minus-square'.classNames() + controller_class}
                    onClick={() => changeValue(-1)}
                ></i>
            </div>
            <div className={'flex-1'.classNames()}>
                <input
                    ref={ref}
                    type="text"
                    onChange={(e) => changeValue(null, e.currentTarget.value)}
                    value={value}
                    onFocus={() => toggleFocusState(true)}
                    onBlur={() => toggleFocusState(false)}
                    className={'text-field-flat text-align-center'.classNames()}
                />
            </div>
            <div className={'height-20'.classNames()}>
                <i
                    className={'ch-icon ch-icon-add-square'.classNames() + controller_class}
                    onClick={() => changeValue(1)}
                ></i>
            </div>
        </div>
    );
}
