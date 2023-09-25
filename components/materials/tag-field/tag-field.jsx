import React from 'react';

import style from './tag.module.scss';

export function TagField({
    theme,
    value,
    options,
    onChange = () => {},
    className = '',
    behavior,
    fullWidth
}) {
    const dispatchChange = (id, checked) => {
        if (behavior == 'radio') {
            onChange(id);
            return;
        }

        let _value = value;
        let index = _value.indexOf(id);

        if (index > -1) {
            _value.splice(index, 1);
        } else {
            _value.push(id);
        }

        onChange(_value);
    };

    const real_control = theme === 'button-control';

    return (
        <div
            className={
                `tag theme-${theme} ${fullWidth ? 'full-width' : ''}`.classNames(style) + className
            }
        >
            {options.map((option) => {
                const { id, label } = option;
                const is_selected = behavior === 'radio' ? value === id : value.indexOf(id) > -1;

                return (
                    <div
                        key={id}
                        className={`${is_selected ? 'active' : ''}`.classNames(style)}
                        onClick={() => dispatchChange(id)}
                    >
                        {(real_control && (
                            <input type={behavior} checked={is_selected} onChange={(e) => {}} />
                        )) ||
                            null}
                        {label}
                    </div>
                );
            })}
        </div>
    );
}
