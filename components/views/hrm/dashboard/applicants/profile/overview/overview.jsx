import React, { useContext } from 'react';
import { ContextApplicantProfile } from '../profile-wrapper.jsx';
import { __, getSocialIcon, prepareTexts } from '../../../../../../utilities/helpers.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import { DangerouslySet } from '../../../../../../materials/DangerouslySet.jsx';

import style from './overview.module.scss';

// To Do: Output contents should be converted html entities from PHP using htmlspecialchars function.

export function OverView() {
    const { applicant = {} } = useContext(ContextApplicantProfile);
    const { summary, education = [], skills = [], qna = [], social_links = [] } = applicant;

    return (
        <div data-crewhrm-selector="overview" className={'overview'.classNames(style)}>
            <span
                className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
            >
                {__('SUMMARY')}
            </span>
            <div>
                <DangerouslySet
                    className={'font-size-15 font-weight-400 line-height-22 letter-spacing-15 color-text'.classNames()}
                >
                    {prepareTexts(summary)}
                </DangerouslySet>
            </div>

            {(education.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('EDUCATION')}
                    </span>
                    <div>
                        {education.map((ed) => {
                            let { education_id, date_from, date_to, degree, institute } = ed;

                            return (
                                <div
                                    data-crewhrm-selector="education"
                                    key={education_id}
                                    className={'d-flex margin-bottom-10'.classNames()}
                                >
                                    <div style={{ width: '150px' }}>
                                        <span
                                            className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text-light'.classNames()}
                                        >
                                            {new Date(date_from).getFullYear()} -{' '}
                                            {new Date(date_to).getFullYear()}
                                        </span>
                                    </div>
                                    <div className={'flex-1'.classNames()}>
                                        <span
                                            className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
                                        >
                                            {degree}{' '}
                                            <span className={'color-text-light'.classNames()}>
                                                at
                                            </span>{' '}
                                            {institute}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )) ||
                null}

            {(skills.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('SKILLS')}
                    </span>
                    <div
                        data-crewhrm-selector="skills"
                        className={'d-flex flex-wrap-wrap flex-direction-row row-gap-15 column-gap-15'.classNames()}
                    >
                        {skills.map((skill) => {
                            return (
                                <div
                                    key={skill}
                                    className={
                                        'single-skill'.classNames(style) +
                                        'd-inline-block padding-vertical-5 padding-horizontal-20 font-size-15 font-weight-500 line-height-24 letter-spacing--15 color-text'.classNames()
                                    }
                                >
                                    {skill}
                                </div>
                            );
                        })}
                    </div>
                </>
            )) ||
                null}

            {(qna.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    {qna.map((q, i) => {
                        let { qna_id, question, answer } = q;
                        return (
                            <div key={qna_id}>
                                <span
                                    className={'d-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 color-text margin-bottom-1'.classNames()}
                                >
                                    {question}
                                </span>
                                <DangerouslySet
                                    className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 color-text'.classNames()}
                                >
                                    {prepareTexts(answer)}
                                </DangerouslySet>

                                <Line
                                    className={'margin-top-20 margin-bottom-20'.classNames()}
                                    show={i < qna.length - 1}
                                />
                            </div>
                        );
                    })}
                </>
            )) ||
                null}

            {(social_links.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    {[...new Set(social_links)].map((link) => {
                        return (
                            <a
                                key={link}
                                href={link}
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                                className={'d-inline-block margin-right-20'.classNames()}
                            >
                                <i
                                    className={
                                        getSocialIcon(link) + 'font-size-20 color-text'.classNames()
                                    }
                                ></i>
                            </a>
                        );
                    })}
                </>
            )) ||
                null}
        </div>
    );
}
