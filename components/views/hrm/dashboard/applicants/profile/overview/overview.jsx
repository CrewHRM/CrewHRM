import React from 'react';
import { __, prepareTexts } from '../../../../../../utilities/helpers.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import { DangerouslySet } from '../../../../../../materials/DangerouslySet.jsx';

import style from './overview.module.scss';

export function OverView({ application = {} }) {
    const { overview = [] } = application;

    return (
        <div data-crewhrm-selector="overview" className={'overview'.classNames(style)}>
            {overview.map((q, i) => {
                const { id, label, text, text_options = [] } = q;

                return (
                    <div key={id}>
                        <span
                            className={'d-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 color-text margin-bottom-1'.classNames()}
                        >
                            {label}
                        </span>

                        {
                            // Render raw textual contents
                            text ? (
                                <DangerouslySet
                                    className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 color-text'.classNames()}
                                >
                                    {prepareTexts(text)}
                                </DangerouslySet>
                            ) : null
                        }

                        {
                            // Render array of texts with tag like look
                            text_options ? (
                                <div
                                    data-crewhrm-selector="skills"
                                    className={'d-flex flex-wrap-wrap flex-direction-row row-gap-15 column-gap-15'.classNames()}
                                >
                                    {text_options.map((o) => {
                                        let { id, label } = o;
                                        return (
                                            <div
                                                key={id}
                                                className={
                                                    'single-skill'.classNames(style) +
                                                    'd-inline-block padding-vertical-5 padding-horizontal-20 font-size-15 font-weight-500 line-height-24 letter-spacing--15 color-text'.classNames()
                                                }
                                            >
                                                {label}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null
                        }

                        <Line
                            className={'margin-top-20 margin-bottom-20'.classNames()}
                            show={i < overview.length - 1}
                        />
                    </div>
                );
            })}

            {!overview.length ? (
                <div className={'color-warning'.classNames()}>{__('No data!')}</div>
            ) : null}
        </div>
    );
}
