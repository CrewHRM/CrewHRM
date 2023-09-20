import React from 'react';
import { __ } from '../../../../utilities/helpers.jsx';
import { Conditional } from '../../../../materials/conditional.jsx';

export function Applied({ error_message }) {
    return <div>
		<Conditional show={error_message}>
			<div className={'text-align-center color-error'.classNames()}>
				{error_message}
			</div>
		</Conditional>

		<Conditional show={!error_message}>
			<div className={'text-align-center color-success'.classNames()}>
				{__('Application has been submitted!')}
			</div>
		</Conditional>
	</div>
}
