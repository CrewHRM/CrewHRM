import React from 'react';

import { settings_fields } from '../field-structure.jsx';
import style from './segments.module.scss';
import { Link } from 'react-router-dom';

export function Segments(props) {
    return (
        <div
            className={
                'container'.classNames(style) + 'padding-top-50 padding-bottom-50'.classNames()
            }
        >
            {Object.keys(settings_fields).map((key) => {
                const { label, description, segments = {} } = settings_fields[key];
                const segment_keys = Object.keys(segments);

                return (
                    <div key={key} className={'margin-bottom-30'.classNames()}>
                        <span
                            className={'d-block font-size-17 font-weight-600 color-text margin-bottom-10'.classNames()}
                        >
                            {label}
                        </span>
                        <span
                            className={'d-block font-size-14 font-weight-400 line-height-22 letter-spacing--14 color-text-light margin-bottom-10'.classNames()}
                        >
                            {description}
                        </span>

                        <div
                            className={'border-1-5 b-color-tertiary border-radius-10 bg-color-white'.classNames()}
                        >
                            {segment_keys.map((segment_key, index) => {
                                const { icon, label } = segments[segment_key];
                                const is_last = index === segment_keys.length - 1;

                                return (
                                    <Link
                                        key={segment_key}
                                        to={`/settings/${key}/${segment_key}/`}
                                        className={`d-flex align-items-center column-gap-10 cursor-pointer padding-vertical-10 padding-horizontal-15 ${
                                            !is_last ? 'border-bottom-1-5 b-color-tertiary' : ''
                                        } color-hover-parent`.classNames()}
                                    >
                                        <div>
                                            <i
                                                className={
                                                    icon.classNames() +
                                                    'font-size-24 color-secondary'.classNames()
                                                }
                                            ></i>
                                        </div>
                                        <div className={'flex-1'.classNames()}>
                                            <span
                                                className={'d-block font-size-15 font-weight-500 line-height-25 color-text'.classNames()}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        <div>
                                            <i
                                                className={'ch-icon ch-icon-arrow-right font-size-24 color-text color-hover-child-secondary'.classNames()}
                                            ></i>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
