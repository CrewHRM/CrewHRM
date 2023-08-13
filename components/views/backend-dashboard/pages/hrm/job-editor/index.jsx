import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { StickyBar } from "../../../../../materials/sticky-bar/sticky-bar.jsx";
import { __ } from "../../../../../utilities/helpers.jsx";

import logo_extended from '../../../../../images/logo-extended.svg';

export function JobEditor() {
	let {job_id: id} = useParams();
	const job_id = id==='new' ? 0 : id;

	const [state, setState] = useState({
		is_auto_saving: true
	});

	return <>
		<StickyBar>
			<div className={'d-flex align-items-center'.classNames()}>
				<div className={'flex-1'.classNames()}>
					<span className={'cursor-pointer'.classNames()} onClick={()=>window.history.back()}>
						<i className={'ch-icon ch-icon-arrow-left font-size-15 text-color-primary margin-right-5 vertical-align-middle'.classNames()}>

						</i> <span className={'font-size-15 font-weight-500 letter-spacing--3 text-color-secondary vertical-align-middle'.classNames()}>
							{__( 'Back' )}
						</span>
					</span>
				</div>
				<div className={'flex-1 text-align-center'.classNames()}>
					<img src={logo_extended} style={{width: 'auto', height: '16px'}} className={'d-inline-block'.classNames()}/> 
				</div>
				<div className={'flex-1 text-align-right'.classNames()}>
					{
						state.is_auto_saving && <span className={'font-size-15 font-weight-400 letter-spacing--3 text-color-secondary margin-right-20'.classNames()}>
							{__( 'Auto saving ...' )}
						</span> || null
					}
					<button className={'button button-primary'.classNames()} disabled={state.is_auto_saving}>
						{__( 'Save and Continue' )}
					</button>
				</div>
			</div>
		</StickyBar>
		<div>This is job editor {job_id}</div>
	</>
}