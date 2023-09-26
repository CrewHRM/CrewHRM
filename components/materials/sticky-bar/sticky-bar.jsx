import React from 'react';
import { Helmet } from 'react-helmet';

import logo from '../../images/logo.svg';
import style from './style.module.scss';

export function StickyBar({ title, children, canBack, midWidth }) {
    const is_children_array = Array.isArray(children);

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/x-icon" href={logo} />
                <title>CrewHRM - {title}</title>
            </Helmet>
            <div
                data-crewhrm-selector="sticky-bar"
                className={
                    'sticky-bar'.classNames(style) +
                    'position-sticky top-32 w-full padding-vertical-15 padding-horizontal-30 bg-color-white'.classNames()
                }
            >
                <div className={'d-flex align-items-center'.classNames()}>
                    {/* First column is always flex-1 */}
                    <div className={'flex-1'.classNames()}>
                        <span className={'d-flex align-items-center column-gap-15'.classNames()}>
                            <i
                                className={`ch-icon ${
                                    canBack
                                        ? 'ch-icon-arrow-left cursor-pointer font-size-15 color-hover-secondary'
                                        : 'ch-icon-menu font-size-10'
                                } color-text`.classNames()}
                                onClick={() => (canBack ? window.history.back() : 0)}
                            ></i>

                            <span
                                className={'font-size-15 font-weight-500 letter-spacing--3 color-text vertical-align-middle'.classNames()}
                            >
                                {title}
                            </span>
                        </span>
                    </div>

                    {/* Second column will be either flex-1 or specific width specified. */}
                    <div
                        className={`${!midWidth ? 'flex-1' : ''} d-flex align-items-center ${
                            is_children_array ? 'justify-content-center' : 'justify-content-end'
                        }`.classNames()}
                        style={midWidth ? { width: midWidth } : {}}
                    >
                        <div>{is_children_array ? children[0] : children}</div>
                    </div>

                    {/* Third column also will be flex-1 to maintain consitent width both side regardles of middle one */}
                    {(is_children_array && (
                        <div
                            className={'flex-1 d-flex align-items-center justify-content-end'.classNames()}
                        >
                            <div>{children[1]}</div>
                        </div>
                    )) ||
                        null}
                </div>
            </div>
        </>
    );
}
