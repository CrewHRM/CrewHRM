import React from "react";
import {createRoot} from 'react-dom/client';
import ReCAPTCHA from "react-google-recaptcha";

import {addAction} from 'crewhrm-materials/hooks.jsx';

function Captcha() {
		
	function onChange(value) {
		console.log("Captcha value:", value);
	}

	return <div className={'margin-bottom-30 d-flex align-items-center justify-content-center'.classNames()}>
		<div>
			<ReCAPTCHA
				sitekey="6LdJ37QUAAAAAFsH-bk_Ypwk4I9H8hNDIT2XxitH"
				onChange={onChange}
			/>
		</div>
	</div>
}

addAction(
	'applicaion_submit_button_before',
	function(el, data) {
		createRoot(el).render(<Captcha {...data}/>)
	}
);
