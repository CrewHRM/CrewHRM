import React from 'react';
import { LoadingIcon } from './loading-icon/loading-icon.jsx';

export function InitState({ fetching, error_message }) {
	if (fetching) {
		return (
			<div className={'padding-vertical-10'.classNames()}>
				<LoadingIcon center={true} />
			</div>
		);
	}

	if (error_message) {
		return (
			<div className={'padding-vertical-10 color-dagner'.classNames()}>{error_message}</div>
		);
	}
}
