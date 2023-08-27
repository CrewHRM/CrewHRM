import React, { useEffect, useRef, useState } from 'react';
import { __ } from '../../utilities/helpers.jsx';

import style from './exp.module.scss';

export function ExpandableContent(props) {
    const [state, setState] = useState({
        expanded: false,
        show_control: false
    });

    const wrapper_ref = useRef();
    const content_ref = useRef();
    let {
        children,
        see_more_text = __('See full view'),
        see_less_text = __('See short view'),
        className = ''
    } = props;

    const adjustLayout = () => {
        if (!wrapper_ref.current || !content_ref.current) {
            return;
        }

        const { offsetHeight: wrapper_height } = wrapper_ref.current;
        const { offsetHeight: content_height } = content_ref.current;
        const show_control = content_height > wrapper_height;

        setState({
            ...state,
            show_control,
            expanded: false
        });
    };

    const toggleView = () => {
        setState({
            ...state,
            expanded: !state.expanded
        });
    };

    useEffect(() => {
        adjustLayout();
        window.addEventListener('resize', adjustLayout);

        return () => {
            window.removeEventListener('resize', adjustLayout);
        };
    }, []);

    return (
        <div data-crewhrm-selector="expandable-content" className={className}>
            <div
                data-crewhrm-selector="content"
                ref={wrapper_ref}
                className={`exp-wrapper ${state.expanded ? 'expanded' : ''}`.classNames(style)}
            >
                <div ref={content_ref} className={'content'.classNames(style)}>
                    {children}
                </div>

                {(state.show_control && !state.expanded && (
                    <div
                        data-crewhrm-selector="overlay"
                        className={'overlay'.classNames(style)}
                    ></div>
                )) ||
                    null}
            </div>
            {(state.show_control && (
                <span
                    data-crewhrm-selector="controller"
                    className={'d-inline-block font-size-15 font-weight-500 line-height-22 letter-spacing--15 color-text cursor-pointer margin-top-10'.classNames()}
                    onClick={toggleView}
                >
                    {state.expanded ? see_less_text : see_more_text}
                </span>
            )) ||
                null}
        </div>
    );
}
