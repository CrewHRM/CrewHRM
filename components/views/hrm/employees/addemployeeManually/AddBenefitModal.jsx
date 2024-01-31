import React from 'react';
import { Modal } from 'crewhrm-materials/modal.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import PlusAsh from 'crewhrm-materials/static/images/plus-ash.svg';

export function AddBenefitModal({ closeModal, onAdd }) {
	return (
		<Modal>
			<div className={'d-flex justify-content-space-between'.classNames()}>
				<span className={'d-block font-size-24 font-weight-600 color-text margin-bottom-30'.classNames()}>
					{__('Add Benefits')}
				</span>
				<i className={'ch-icon ch-icon-times cursor-pointer font-size-30 color-text-light'.classNames()}></i>
			</div>
			<hr style={{ borderColor: '#E3E5E8' }} />
			<div className={'padding-vertical-15'.classNames()}>
				<span className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}>
					{__('Benefits Title')}
				</span>

				<input
					placeholder={__('ex. Health')}
					type="text"
					className={'width-p-100 padding-15 border-1-5 b-color-tertiary b-color-active-primary border-radius-10 height-48 font-size-15 font-weight-400 line-height-25 color-text'.classNames()}
					onChange={() => ''}
				/>
			</div>
			<div
				className={'d-flex align-items-center column-gap-5 margin-top-5 margin-bottom-20 cursor-pointer'.classNames()}
			>
				<img src={PlusAsh} alt="" />
				<span className={'d-block font-size-13 font-weight-500 color-text'.classNames()}>
					{__('Add Description')}
				</span>
			</div>
			<div className={'d-flex align-items-center justify-content-end column-gap-21'.classNames()}>
				<button className={'button button-primary'.classNames()} onClick={() => ''} disabled={false}>
					{__('Add Benefits')}
				</button>
			</div>
		</Modal>
	);
}
