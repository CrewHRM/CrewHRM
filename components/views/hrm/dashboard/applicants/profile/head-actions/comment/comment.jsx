import React from "react";
import { __ } from "../../../../../../../utilities/helpers.jsx";

export function Comment(props) {
	const {onClose} = props;

	return <>
		<textarea 
			className={'margin-top-15 margin-bottom-15 border-radius-5 border-1-5 border-color-tertiary padding-15 font-size-15 font-weight-500 d-block'.classNames()} 
			placeholder={__( 'Write your comments' )} 
			style={{width: '100%', height: '69%', resize: 'vertical'}}></textarea>

		<div className={'d-flex align-items-center'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<i className={'ch-icon ch-icon-paperclip-2 font-size-20 text-color-primary vertical-align-middle'.classNames()}>
				
				</i> <span className={'font-size-15 font-weight-400 text-color-primary'.classNames()}>
					{__( 'Attach a file' )}
				</span>
			</div>
			<div>
				<button className={'button button-primary'.classNames()}>
					{__( 'Submit Comment' )}
				</button>
			</div>
		</div>
	</>
}