import React from "react";

export function Comment(props) {
	const {onClose} = props;

	return <>
		<div className={'d-flex align-items-center'.classNames()}>
			<div className={'flex-1'.classNames()}>
				<span className={'ch-icon ch-icon ch-icon-message font-size-20 text-color-primary'.classNames()}>

				</span> <span>

				</span>
			</div>
			<div></div>
		</div>
	</>
}