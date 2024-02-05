import React, { useState } from 'react';

import { Modal } from 'crewhrm-materials/modal.jsx';
import { __, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';

import PlusAsh from 'crewhrm-materials/static/images/plus-ash.svg';

export function AddBenefitModal({ onClose, onAdd }) {

	const [state, setState] = useState({
		desc_field: false,
		label: '',
		description: ''
	});

	const setValue=(name, value)=>{
		setState({
			...state,
			[name]: value
		});
	}

	return (
		<Modal 
			closeOnDocumentClick={false} 
			onClose={onClose}
		>
			<div className={'d-flex justify-content-space-between'.classNames()}>
				<span className={'d-block font-size-24 font-weight-600 color-text margin-bottom-30'.classNames()}>
					{__('Add Benefits')}
				</span>
				<i 
					className={'ch-icon ch-icon-times cursor-pointer font-size-30 color-text-light'.classNames()}
					onClick={onClose}
				></i>
			</div>
			<hr style={{ borderColor: '#E3E5E8' }} />
			<div className={'padding-vertical-15'.classNames()}>
				<span className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}>
					{__('Benefits Title')}
				</span>

				<input
					placeholder={__('ex. Health')}
					type="text"
					value={state.label}
					className={'width-p-100 padding-15 border-1-5 b-color-tertiary b-color-active-primary border-radius-10 height-48 font-size-15 font-weight-400 line-height-25 color-text'.classNames()}
					onChange={(e) => setValue('label', e.currentTarget.value)}
				/>
			</div>
			<div className={'margin-top-5 margin-bottom-20'.classNames()}>
				{
					state.desc_field ? 
						<>
							<span className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}>
								{__('Benefits Description')}
							</span>

							<TextField
								type="textarea"
								value={state.description}
								onChange={v=>setValue('description', v)}
							/>
						</>
						:
						<div 
							className={'d-inline-flex align-items-center column-gap-5 cursor-pointer'.classNames()}
							onClick={()=>setValue('desc_field', true)}
						>
							<img src={PlusAsh} alt="" />
							<span className={'d-block font-size-13 font-weight-500 color-text'.classNames()}>
								{__('Add Description')}
							</span>
						</div>
				}
			</div>
			<div className={'d-flex align-items-center justify-content-end column-gap-21'.classNames()}>
				<button 
					className={'button button-primary'.classNames()} 
					onClick={() => onAdd({label: state.label, description: state.description})} 
					disabled={isEmpty(state.label)}
				>
					{__('Add Benefits')}
				</button>
			</div>
		</Modal>
	);
}
