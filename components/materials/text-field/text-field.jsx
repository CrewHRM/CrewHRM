import React, { useEffect, useRef, useState } from 'react';

import style from './text-field.module.scss';

export function TextField(props) {
    const {
        iconClass,
        image,
        icon_position = 'left',
        type = 'text',
        onChange,
        onIconClick: clickHandler,
        placeholder,
        className = '',
        inputClassName = '',
        pattern,
        value,
        maxLength = null,
        expandable = false
    } = props;

    const [state, setState] = useState({
        expanded: !expandable,
        focused: false
    });

    const input_ref = useRef();

    const dispatchChange = (v) => {
        if (maxLength !== null && v.length > maxLength) {
            return;
        }

        onChange(v);
    };

    const onIconClick = () => {
        if (clickHandler) {
            clickHandler(() => {
                if (input_ref?.current) {
                    input_ref.current.focus();
                }
            });
            return;
        }

        if (!expandable) {
            return;
        }

        setState({
            ...state,
            expanded: !state.expanded
        });
    };

    const toggleFocusState = (focused) => {
        setState({
            ...state,
            focused
        });
    };

    useEffect(() => {
        if (!state.expanded || !input_ref?.current) {
            return;
        }

        if (props.expandable) {
            input_ref.current.focus();
        }
    }, [state.expanded]);

    const separator =
        (state.expanded && <span className={'d-inline-block width-6'.classNames()}></span>) || null;

    return (
        <div
            data-crewhrm-selector="text-field"
            className={
                `text-field`.classNames(style) +
                `d-flex align-items-center ${
                    icon_position == 'right' ? 'flex-direction-row-reverse' : 'flex-direction-row'
                } ${state.focused ? 'active' : ''}`.classNames() +
                className
            }
        >
            {(iconClass && (
                <>
                    <i className={iconClass} onClick={() => onIconClick()}></i>
                    {separator}
                </>
            )) ||
                null}

            {(image && state.expanded && (
                <>
                    <img
                        src={image}
                        className={'image'.classNames(style)}
                        onClick={() => onIconClick()}
                    />
                    {separator}
                </>
            )) ||
                null}

            {(state.expanded && (
                <input
                    ref={input_ref}
                    type={type}
                    value={value}
                    onChange={(e) => dispatchChange(e.currentTarget.value)}
                    onFocus={() => toggleFocusState(true)}
                    onBlur={() => toggleFocusState(false)}
                    placeholder={placeholder}
                    className={
                        'text-field-flat font-size-15 font-weight-500 letter-spacing--15 flex-1'.classNames() +
                        inputClassName
                    }
                    pattern={pattern}
                />
            )) ||
                null}
        </div>
    );
}
