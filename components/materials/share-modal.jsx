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
		icon: facebook,
		sharer: 'https://www.facebook.com/sharer/sharer.php?u=%s'
	},
	{
		label: __('Linkedin'),
		icon: linkedin,
		sharer: 'https://www.linkedin.com/sharing/share-offsite/?url=%s'
	},
	{
		label: __('Twitter'),
		icon: twitter,
		sharer: 'https://twitter.com/intent/tweet?url=%s'
	},
	{
		label: __('Reddit'),
		icon: reddit,
		sharer: 'https://www.reddit.com/submit?url=%s'
	},
	{
		label: __('Email'),
		icon: email,
		sharer: 'mailto:?body=%s'
	}
];

export function ShareModal(props) {
	const { url, closeModal } = props;
	const { addToast } = useContext(ContextToast);

	const openSharer = (url, sharer) => {
		url = 'http://google.com';
		let urlToLoad = sharer.replace('%s', encodeURIComponent(url));

		// Define the dimensions of the popup window
		var width = 500;
		var height = 550;

		// Calculate the left and top positions to center the window
		var left = (window.screen.width - width) / 2;
		var top = (window.screen.height - height) / 2;

		// Open the popup window centered on the screen
		window.open(
			urlToLoad,
			'PopupWindow',
			'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
		);
	};

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
						<div
							key={index}
							className={'text-align-center darken-on-hover--9 cursor-pointer'.classNames()}
							onClick={() => openSharer(url, target.sharer)}
						>
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
