import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { request } from "crewhrm-materials/request.jsx";
import { mountExternal } from "crewhrm-materials/render-external.jsx";
import {addAction} from 'crewhrm-materials/hooks.jsx';
import {LoadingIcon} from 'crewhrm-materials/loading-icon/loading-icon.jsx';

function Captcha({onChange}) {

	const [state, setState] = useState({
		fetching: true,
		site_key: ''
	});
	
	const getKey=()=>{
		request('getRecaptchaKeys', {}, resp=>{
			const {success, data:{site_key}} = resp;

			setState({
				...state,
				fetching: false,
				site_key
			});
		});
	}

	useEffect(getKey, []);

	return <div className={'margin-bottom-30 d-flex align-items-center justify-content-center'.classNames()}>
		<div>
			{
				state.fetching ? <LoadingIcon center={true}/> : <ReCAPTCHA
					sitekey={state.site_key}
					onChange={value=>onChange('recaptcha_token', value)}
				/>
			}
		</div>
	</div>
}

addAction(
	'applicaion_submit_button_before',
	function(el, data) {
		if ( data.payload.is_final_stage ) {
			mountExternal(
				'recaptcha_in_application', 
				el, 
				data.session, 
				<Captcha {...data.payload}/>
			);
		}
	}
);
