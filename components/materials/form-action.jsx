import React from 'react';
import { __ } from '../utilities/helpers.jsx';
import { Conditional } from './conditional.jsx';

export function FormActionButtons(props) {
	const {
		onBack,
		onNext,
		backText = __('Back'),
		nextText = __('Next'),
		disabledPrevious = false,
		disabledNext = false
	} = props;

	return (
		<div className={'d-flex column-gap-40 margin-bottom-30'.classNames()}>
			<Conditional show={onBack}>
				<div style={{ width: '138px' }}>
					<button
						disabled={disabledPrevious}
						className={'d-inline-block button button-primary button-outlined button-outlined-secondary button-full-width'.classNames()}
						onClick={onBack}
					>
						{backText}
					</button>
				</div>
			</Conditional>

			<Conditional show={onNext}>
				<div className={'flex-1'.classNames()}>
					<button
						disabled={disabledNext}
						className={'button button-primary button-full-width'.classNames()}
						onClick={onNext}
					>
						{nextText}
					</button>
				</div>
			</Conditional>
		</div>
	);
}
