import React from 'react';
import { getRandomString } from '../../utilities/helpers.jsx';

import style from './switch.module.scss';

export function ToggleSwitch(props) {
    const { className = '', disabled = false, onChange, checked = false } = props;
    const id = getRandomString();
    return (
        <div
            data-crewhrm-selector="toggle-switch"
            className={
                `d-inline-block ${disabled ? 'disabled' : ''}`.classNames() +
                `switch ${disabled ? 'disabled' : ''}`.classNames(style) +
                className
            }
        >
            <input
                id={id}
                checked={checked}
                type="checkbox"
                data-checkbox-type="toggle"
                onChange={(e) => onChange(e.currentTarget.checked ? true : false)}
            />
            <label htmlFor={id}></label>
        </div>
    );
}
