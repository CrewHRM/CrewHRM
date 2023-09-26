import React, { useEffect, useRef, useState } from 'react';

import { Conditional } from '../conditional.jsx';
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
        inputDelay,
        maxLength = null,
        expandable = false
    } = props;

    const input_ref = useRef();

    const [text, setText] = useState(value || '');

    const [state, setState] = useState({
        expanded: !expandable,
        focused: false
    });

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

    useEffect(() => {
		if ( ! inputDelay ) {
			return;
		}
		
        const timer = window.setTimeout(() => {
            dispatchChange(text);
        }, inputDelay);

        return () => window.clearInterval(timer);
    }, [text]);

    const separator = state.expanded ? (
        <span className={'d-inline-block width-6'.classNames()}></span>
    ) : null;

    const attr = {
        type,
        pattern,
        placeholder,
        ref: input_ref,
        value: !inputDelay ? value : text,
        onChange: (e) =>
            !inputDelay ? dispatchChange(e.currentTarget.value) : setText(e.currentTarget.value),
        onFocus: () => toggleFocusState(true),
        onBlur: () => toggleFocusState(false),
        className:
            'text-field-flat font-size-15 font-weight-500 letter-spacing--15 flex-1'.classNames() +
            inputClassName
    };

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
            <Conditional show={iconClass}>
                <i className={iconClass} onClick={() => onIconClick()}></i>
                {separator}
            </Conditional>

            <Conditional show={image && state.expanded}>
                <img
                    src={image}
                    className={'image'.classNames(style)}
                    onClick={() => onIconClick()}
                />
                {separator}
            </Conditional>

            <Conditional show={state.expanded}>
                <Conditional show={type !== 'textarea'}>
                    <input {...attr} />
                </Conditional>

                <Conditional show={type === 'textarea'}>
                    <textarea {...attr}></textarea>
                </Conditional>
            </Conditional>
        </div>
    );
}
