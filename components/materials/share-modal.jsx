import React, { useContext } from 'react';
import { Modal } from './modal.jsx';
import { __, copyToClipboard } from '../utilities/helpers.jsx';

import facebook from '../images/brands/facebook.svg';
import linkedin from '../images/brands/linkedin.svg';
import twitter from '../images/brands/twitter.svg';
import reddit from '../images/brands/reddit.svg';
import email from '../images/brands/email.svg';
import { ContextToast } from './toast/toast.jsx';

const targets = [
    {
        label: __('Facebook'),
        icon: facebook
    },
    {
        label: __('Linkedin'),
        icon: linkedin
    },
    {
        label: __('Twitter'),
        icon: twitter
    },
    {
        label: __('Reddit'),
        icon: reddit
    },
    {
        label: __('Email'),
        icon: email
    }
];

export function ShareModal(props) {
    const { url, closeModal } = props;
    const { addToast } = useContext(ContextToast);

    return (
        <Modal>
            <div
                data-crewhrm-selector="share-close"
                className={'d-flex align-items-center'.classNames()}
            >
                <div className={'flex-1'.classNames()}>
                    <span className={'font-size-20 font-weight-500 color-text'.classNames()}>
                        {__('Share')}
                    </span>
                </div>
                <div>
                    <i
                        className={'ch-icon ch-icon-times font-size-18 color-text-light cursor-pointer'.classNames()}
                        onClick={closeModal}
                    ></i>
                </div>
            </div>
            <div
                data-crewhrm-selector="share-targets"
                className={'d-flex align-items-center justify-content-space-between padding-vertical-40'.classNames()}
            >
                {targets.map((target, index) => {
                    return (
                        <div key={index} className={'text-align-center'.classNames()}>
                            <img src={target.icon} className={'width-44'.classNames()} />
                            <span
                                className={'d-block margin-top-12 font-size-16 font-weight-400 color-text-light'.classNames()}
                            >
                                {target.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div
                data-crewhrm-selector="share-link"
                className={'d-flex align-items-center border-1-5 b-color-tertiary padding-20 border-radius-10'.classNames()}
                style={{ backgroundColor: '#F9F9F9' }}
            >
                <span
                    className={'flex-1 font-size-16 font-weight-400 letter-spacing--3 color-text'.classNames()}
                >
                    {url}
                </span>
                <span
                    className={'cursor-pointer'.classNames()}
                    onClick={() => copyToClipboard(url, addToast)}
                >
                    <i
                        className={'ch-icon ch-icon-copy font-size-24 color-text-light margin-right-8 vertical-align-middle'.classNames()}
                    ></i>
                    <span
                        className={'font-size-16 font-weight-400 letter-spacing--3 color-text-light vertical-align-middle'.classNames()}
                    >
                        {__('Copy')}
                    </span>
                </span>
            </div>
        </Modal>
    );
}
