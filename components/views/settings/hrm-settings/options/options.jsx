import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { settings_fields } from '../field-structure.jsx';
import { ContextSettings } from '../hrm-settings.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { input_class } from '../../../hrm/job-editor/job-details/job-details.jsx';
import { FileUpload } from 'crewhrm-materials/file-ipload/file-upload.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { NumberField } from 'crewhrm-materials/number-field.jsx';
import { RadioCheckbox } from 'crewhrm-materials/radio-checkbox.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { ContextBackendDashboard } from '../../../hrm/hrm.jsx';

import style from './options.module.scss';
import { RenderMedia } from 'crewhrm-materials/render-media/render-media.jsx';

const label_class =
    'd-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 color-text'.classNames();

const hint_class =
    'd-block margin-top-3 font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text-light'.classNames();

export function Options(props) {
    const { segment, sub_segment } = useParams();
    const { values = {}, onChange } = useContext(ContextSettings);
    const { resources = {} } = useContext(ContextBackendDashboard);

    const { fields, icon, label } = settings_fields[segment].segments[sub_segment];
    const field_keys = Object.keys(fields);

    const satisfyLogic = (when) => {
        const pointer = when[0];
        const operator = when.length > 2 ? when[1] : '===';
        const operand = when[when.length > 2 ? 2 : 1];
        const value = values[pointer];

        let _return;

        switch (operator) {
            case '===':
                _return = value === operand;
                break;

            case '==':
                _return = value == operand;
                break;
        }

        return _return;
    };

    return (
        <div
            className={
                'container'.classNames(style) + 'padding-top-50 padding-bottom-50'.classNames()
            }
        >
            <div
                className={'padding-30 bg-color-white border-radius-5 box-shadow-thin'.classNames()}
            >
                <span
                    className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text-light'.classNames()}
                >
                    {label}
                </span>

                {field_keys.map((key, index) => {
                    const { label, type, options, when, direction, hint, placeholder, min, max, disabled } =
                        fields[key];
                    const is_last = index == field_keys.length - 1;

                    if (when && !satisfyLogic(when)) {
                        return null;
                    }

                    const label_text = (
                        <>
                            <span className={label_class}>{label}</span>
                            {(hint && <span className={hint_class}>{hint}</span>) || null}
                        </>
                    );

                    return (
                        <div
                            key={key}
                            className={`d-flex ${
                                direction === 'column'
                                    ? 'flex-direction-column'
                                    : 'flex-direction-row align-items-center'
                            } flex-wrap-wrap padding-vertical-25 ${
                                !is_last ? 'border-bottom-1 b-color-tertiary' : ''
                            } ${when ? 'fade-in' : ''}`.classNames()}
                        >
                            {/* Toggle switch option */}
                            {(type === 'switch' && (
                                <>
                                    <div className={'flex-1'.classNames()}>{label_text}</div>
                                    <div>
                                        <ToggleSwitch
                                            checked={values[key] ? true : false}
                                            onChange={(enabled) => onChange(key, enabled)}
                                        />
                                    </div>
                                </>
                            )) ||
                                null}

                            {/* Text input field */}
                            {(type === 'text' && (
                                <>
                                    <div className={'flex-1'.classNames()}>{label_text}</div>
                                    <div className={'flex-1'.classNames()}>
                                        <TextField
                                            value={values[key]}
                                            className={input_class}
                                            onChange={(v) => onChange(key, v)}
                                        />
                                    </div>
                                </>
                            )) ||
                                null}

                            {/* Image upload */}
                            {type === 'image' ? (
                                <>
                                    <div className={'flex-1'.classNames()}>{label_text}</div>
                                    <div className={'flex-1'.classNames()}>
                                        {!values[key] ? (
                                            <FileUpload
                                                accept="image/*"
                                                WpMedia={{ width: 1200, height: 300 }}
                                                onChange={(file) => onChange(key, file)}
                                            />
                                        ) : (
                                            <RenderMedia
                                                theme="singular"
                                                media={values[key]}
                                                onDelete={() => onChange(key, null)}
                                                overlay={false}
                                            />
                                        )}
                                    </div>
                                </>
                            ) : null}

                            {/* Checkbox options */}
                            {((type === 'checkbox' || type == 'radio') && (
                                <>
                                    <div className={'margin-bottom-15'.classNames()}>
                                        {label_text}
                                    </div>
                                    <div
                                        className={'d-flex flex-direction-column row-gap-10'.classNames()}
                                    >
                                        <RadioCheckbox
                                            type={type}
                                            name={key}
                                            value={values[key]}
                                            options={options}
                                            onChange={(value) => onChange(key, value)}
                                            spanClassName={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
                                        />
                                    </div>
                                </>
                            )) ||
                                null}

                            {/* Number field options */}
                            {type === 'number' ? (
                                <>
                                    <div className={'flex-5'.classNames()}>{label_text}</div>
                                    <div className={'flex-2'.classNames()}>
                                        <NumberField
                                            min={min}
                                            max={max}
											disabled={disabled}
                                            value={values[key]}
                                            className={input_class}
                                            onChange={(v) => onChange(key, v)}
                                        />
                                    </div>
                                </>
                            ) : null}

                            {type == 'dropdown' ? (
                                <>
                                    <div className={'flex-5'.classNames()}>{label_text}</div>
                                    <div className={'flex-2'.classNames()}>
                                        <DropDown
                                            className={input_class}
                                            value={values[key]}
                                            onChange={(v) => onChange(key, v)}
                                            options={
                                                typeof options === 'string'
                                                    ? resources[options] || []
                                                    : []
                                            }
                                            placeholder={placeholder}
                                        />
                                    </div>
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
