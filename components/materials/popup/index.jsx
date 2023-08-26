import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';

import {
    useOnEscape,
    useRepositionOnResize,
    useOnClickOutside,
    useTabbing,
    useIsomorphicLayoutEffect
} from './hooks.jsx';
import calculatePosition from './Utils.jsx';

import styles from './styles.jsx';
import style from './index.module.scss';

let popupIdCounter = 0;

const getRootPopup = () => {
    let PopupRoot = document.getElementById('crewhrm-popup-root');

    if (PopupRoot === null) {
        PopupRoot = document.createElement('div');
        PopupRoot.setAttribute('id', 'crewhrm-popup-root');
        document.body.appendChild(PopupRoot);
    }

    return PopupRoot;
};

export const Popup = forwardRef(
    (
        {
            trigger = null,
            onOpen = () => {},
            onClose = () => {},
            defaultOpen = false,
            open = undefined,
            disabled = false,
            nested = false,
            closeOnDocumentClick = true,
            repositionOnResize = true,
            closeOnEscape = true,
            on = ['click'],
            contentStyle = {},
            arrowStyle = {},
            overlayStyle = {},
            className = '',
            position = 'bottom center',
            modal = false,
            lockScroll = false,
            arrow = true,
            offsetX = 0,
            offsetY = 0,
            mouseEnterDelay = 100,
            mouseLeaveDelay = 100,
            keepTooltipInside = false,
            children,
            darken = true
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(open || defaultOpen);
        const triggerRef = useRef(null);
        const contentRef = useRef(null);
        const arrowRef = useRef(null);
        const focusedElBeforeOpen = useRef(null);
        const popupId = useRef(`crewhrm-popup-${++popupIdCounter}`);

        const isModal = modal ? true : !trigger;
        const timeOut = useRef(0);

        useIsomorphicLayoutEffect(() => {
            if (isOpen) {
                focusedElBeforeOpen.current = document.activeElement;
                setPosition();
                focusContentOnOpen(); // for accessibility
                lockScrolll();
            } else {
                resetScroll();
            }
            return () => {
                clearTimeout(timeOut.current);
            };
        }, [isOpen]);

        // for uncontrolled popup we need to sync isOpen with open prop
        useEffect(() => {
            if (typeof open === 'boolean') {
                if (open) openPopup();
                else closePopup();
            }
        }, [open, disabled]);

        const openPopup = (event) => {
            if (isOpen || disabled) return;
            setIsOpen(true);
            setTimeout(() => onOpen(event), 0);
        };

        const closePopup = (event) => {
            if (!isOpen || disabled) return;
            setIsOpen(false);
            if (isModal) focusedElBeforeOpen.current?.focus();
            setTimeout(() => onClose(event), 0);
        };

        const togglePopup = (event) => {
            event?.stopPropagation();
            if (!isOpen) openPopup(event);
            else closePopup(event);
        };

        const onMouseEnter = (event) => {
            clearTimeout(timeOut.current);
            timeOut.current = setTimeout(() => openPopup(event), mouseEnterDelay);
        };

        const onContextMenu = (event) => {
            event?.preventDefault();
            togglePopup();
        };

        const onMouseLeave = (event) => {
            clearTimeout(timeOut.current);
            timeOut.current = setTimeout(() => closePopup(event), mouseLeaveDelay);
        };

        const lockScrolll = () => {
            if (isModal && lockScroll)
                document.getElementsByTagName('body')[0].style.overflow = 'hidden'; // migrate to document.body
        };

        const resetScroll = () => {
            if (isModal && lockScroll)
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
        };
        const focusContentOnOpen = () => {
            const focusableEls = contentRef?.current?.querySelectorAll(
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
            );
            const firstEl = Array.prototype.slice.call(focusableEls)[0];
            firstEl?.focus();
        };

        useImperativeHandle(ref, () => ({
            open: () => {
                openPopup();
            },
            close: () => {
                closePopup();
            },
            toggle: () => {
                togglePopup();
            }
        }));

        // set Position
        const setPosition = () => {
            if (isModal || !isOpen) return;
            if (!triggerRef?.current || !triggerRef?.current || !contentRef?.current) return; /// show error as one of ref is undefined
            const trigger = triggerRef.current.getBoundingClientRect();
            const content = contentRef.current.getBoundingClientRect();

            const cords = calculatePosition(
                trigger,
                content,
                position,
                arrow,
                {
                    offsetX,
                    offsetY
                },
                keepTooltipInside
            );
            contentRef.current.style.top = `${cords.top + window.scrollY}px`;
            contentRef.current.style.left = `${cords.left + window.scrollX}px`;
            if (arrow && !!arrowRef.current) {
                arrowRef.current.style.transform = cords.transform;
                arrowRef.current.style.setProperty('-ms-transform', cords.transform);
                arrowRef.current.style.setProperty('-webkit-transform', cords.transform);
                arrowRef.current.style.top = arrowStyle.top?.toString() || cords.arrowTop;
                arrowRef.current.style.left = arrowStyle.left?.toString() || cords.arrowLeft;
            }
        };
        // hooks
        // useOnEscape(closePopup, closeOnEscape) // can be optimized if we disabled for hover
        useTabbing(contentRef, isOpen && isModal);
        useRepositionOnResize(setPosition, repositionOnResize);
        useOnClickOutside(
            !!trigger ? [contentRef, triggerRef] : [contentRef],
            closePopup,
            closeOnDocumentClick && !nested
        ); // we need to add a ne
        // render the trigger element and add events
        const renderTrigger = () => {
            const triggerProps = {
                key: 'T',
                ref: triggerRef,
                'aria-describedby': popupId.current
            };
            const onAsArray = Array.isArray(on) ? on : [on];
            for (let i = 0, len = onAsArray.length; i < len; i++) {
                switch (onAsArray[i]) {
                    case 'click':
                        triggerProps.onClick = togglePopup;
                        break;
                    case 'right-click':
                        triggerProps.onContextMenu = onContextMenu;
                        break;
                    case 'hover':
                        triggerProps.onMouseEnter = onMouseEnter;
                        triggerProps.onMouseLeave = onMouseLeave;
                        break;
                    case 'focus':
                        triggerProps.onFocus = onMouseEnter;
                        triggerProps.onBlur = onMouseLeave;
                        break;
                    default:
                }
            }

            if (typeof trigger === 'function') {
                const comp = trigger(isOpen);
                return !!trigger && React.cloneElement(comp, triggerProps);
            }

            return !!trigger && React.cloneElement(trigger, triggerProps);
        };

        const addWarperAction = () => {
            const popupContentStyle = isModal
                ? styles.popupContent.modal
                : styles.popupContent.tooltip;

            const childrenElementProps = {
                className:
                    `popup-content ${isModal ? 'modal' : 'popup'} ${
                        className !== ''
                            ? className
                                  .split(' ')
                                  .map((c) => `${c}-content`)
                                  .join(' ')
                            : ''
                    }`.classNames(style) + 'root'.classNames(),
                style: {
                    ...popupContentStyle,
                    ...contentStyle,
                    pointerEvents: 'auto' //closeOnDocumentClick && nested ? 'auto' : 'none',
                },
                ref: contentRef,
                onClick: (e) => {
                    e.stopPropagation();
                }
            };
            if (!modal && on.indexOf('hover') >= 0) {
                childrenElementProps.onMouseEnter = onMouseEnter;
                childrenElementProps.onMouseLeave = onMouseLeave;
            }
            return childrenElementProps;
        };

        const renderContent = () => {
            return (
                <div
                    {...addWarperAction()}
                    key="C"
                    role={isModal ? 'dialog' : 'tooltip'}
                    id={popupId.current}
                >
                    {arrow && !isModal && (
                        <div ref={arrowRef} style={styles.popupArrow}>
                            <svg
                                data-testid="arrow"
                                className={`popup-arrow ${
                                    className !== ''
                                        ? className
                                              .split(' ')
                                              .map((c) => `${c}-arrow`)
                                              .join(' ')
                                        : ''
                                }`.classNames(style)}
                                viewBox="0 0 32 16"
                                style={{
                                    position: 'absolute',
                                    ...arrowStyle
                                }}
                            >
                                <path d="M16 0l16 16H0z" fill="currentcolor" />
                            </svg>
                        </div>
                    )}
                    {children && typeof children === 'function'
                        ? children(closePopup, isOpen)
                        : children}
                </div>
            );
        };

        const overlay = !(on.indexOf('hover') >= 0);
        const ovStyle = isModal ? styles.overlay.modal : styles.overlay.tooltip;

        const content = [
            overlay && (
                <div
                    key="O"
                    data-testid="overlay"
                    data-popup={isModal ? 'modal' : 'tooltip'}
                    className={`popup-overlay ${
                        className !== ''
                            ? className
                                  .split(' ')
                                  .map((c) => `${c}-overlay`)
                                  .join(' ')
                            : ''
                    } ${darken ? 'darken' : ''}`.classNames(style)}
                    style={{
                        ...ovStyle,
                        ...overlayStyle,
                        pointerEvents: (closeOnDocumentClick && nested) || isModal ? 'auto' : 'none'
                    }}
                    onClick={closeOnDocumentClick && nested ? closePopup : undefined}
                    tabIndex={-1}
                >
                    {isModal && renderContent()}
                </div>
            ),

            !isModal && renderContent()
        ];

        return (
            <>
                {renderTrigger()}
                {isOpen && ReactDOM.createPortal(content, getRootPopup())}
            </>
        );
    }
);
