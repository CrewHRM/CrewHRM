import React, { useState, useEffect, useContext } from "react";

import {MountPoint} from 'crewhrm-materials/mountpoint.jsx';
import {LoadingIcon} from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import {request} from 'crewhrm-materials/request.jsx';
import {ContextToast} from 'crewhrm-materials/toast/toast.jsx';
import {TextField} from 'crewhrm-materials/text-field/text-field.jsx';
import { __, isEmpty } from "crewhrm-materials/helpers.jsx";
import { ExpandableInstruction } from "crewhrm-materials/expandable-instruction.jsx";
import { addFilter } from "crewhrm-materials/hooks.jsx";
import { mountExternal } from "crewhrm-materials/render-external.jsx";

import recaptcha_icon from './images/recaptcha-icon.svg';
import banner_img from './images/banner.png';

import style from './settings.module.scss';

const fields = {
	site_key: {
		label: __('Site Key')
	},
	secret_key: {
		label: __('Secret Key'),
		type: 'password'
	},
}

export function CaptchaSettings() {

	const {ajaxToast} = useContext(ContextToast);

	const [state, setState] = useState({
		saving: false,
		has_changes: false,
		fetching: true,
		values: {
			site_key: '',
			secret_key: '',
		}
	});
	
	const setVal=(name, value)=>{
		setState({
			...state,
			has_changes: true,
			values: {
				...state.values,
				[name]: value
			}
		});
	}

	const getStatus=()=>{
		
		request('getRecaptchaKeys', {}, resp=>{
			const {success, data:{site_key, secret_key}} = resp;

			if ( ! success ) {
				ajaxToast(resp);
			}

			setState({
				...state,
				fetching: false,
				values:{
					site_key, 
					secret_key
				}
			});
		});
	}

	const saveRecaptchaKeys=()=>{
		const {values: {site_key, secret_key}} = state;

		setState({
			...state,
			saving: true
		});

		request('saveRecaptchaKeys', {site_key, secret_key}, resp=>{
			ajaxToast(resp);
			
			setState({
				...state,
				saving: false,
				has_changes: !resp.success
			});
		});
	}

	useEffect(getStatus, []);

	const is_fields_filled = Object.keys(fields).filter(name=>isEmpty(state.values[name])).length===0;
	const className = `position-relative overflow-hidden bg-color-white box-shadow-thin margin-bottom-20 border-radius-5`.classNames();

	return <div className={'section'.classNames(style)}>
		{
			state.fetching ? 
			<><LoadingIcon center={true}/><br/></> : 
			<div className={className + 'd-flex column-gap-60 padding-40'.classNames()}>
				<div style={{width: '235px'}}>
					<img src={banner_img} style={{maxWidth: '175px'}} className={'d-block margin-bottom-16 height-auto'.classNames()}/>
					
					<strong className={'d-block font-size-24 margin-bottom-10 font-weight-600 color-text line-height-30'.classNames()}>
						{__('reCAPTCHA Setup')}
					</strong>
					
					<span className={'font-size-14 font-weight-400 line-height-23 color-text'.classNames()}>
						{__('Get credentials from ')} <a
							href="http://www.google.com/recaptcha/admin" 
							target="_blank" 
							className={'font-size-14 font-weight-600 color-text hover-underline'.classNames()}
						>
							{__('reCAPTCHA Dashboard')}
						</a>
					</span>
				</div>
				<div className={'flex-1'.classNames()}>
					{
						Object.keys(fields).map(name=>{
							const {label, type='text'} = fields[name];
							return <div key={name} className={'padding-vertical-10'.classNames()}>
								<span className={'d-block font-size-15 font-weight-500 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}>
									{label}<span className={'color-error'.classNames()}>*</span>
								</span>
								<TextField
									type={type}
									value={state.values[name]}
									onChange={v=>setVal(name, v)}/>
							</div>
						})
					}

					<button 
						className={'width-p-100 button button-primary margin-top-25'.classNames()} 
						onClick={saveRecaptchaKeys} 
						disabled={!state.has_changes || !is_fields_filled || state.saving}
					>
						{__('Save Keys')} <LoadingIcon show={state.saving}/>
					</button>
				</div>
			</div>
		}

		<div className={className + 'padding-20'.classNames()}>
			<ExpandableInstruction
				title={__('Setup your reCaptcha Integration')}
				description={__('Credentials to connect reCaptcha with your website')}
			>
				<ul style={{paddingLeft: '12px'}}>
					<li>
						Go to <a href="http://www.google.com/recaptcha/admin" target="_blank" className={'font-weight-500'.classNames()}>http://www.google.com/recaptcha/admin</a>
					</li>
					<li>Click <strong className={'font-weight-500'.classNames()}>"+"</strong> icon at the top right corner</li>
					<li>Give the project a label</li>
					<li>Select <i>Challenge (v2)</i> as reCAPTCHA type</li>
					<li>Select <i>"I'm not a robot" Checkbox</i></li>
					<li>Add your domain without protocol, path, port, query or fragment</li>
					<li>Now submit</li>
					<li>Obtain Site Key and Secret key from the next screen and paste here</li>
				</ul>
			</ExpandableInstruction>
		</div>
	</div> 
}

addFilter(
	'crewhrm_setting_fields',
	function( settings={} ) {
		settings.integrations.segments['google-recaptcha'] = {
			label: __('reCaptcha integration'),
			icon: recaptcha_icon,
			useWrapper: false,
			component: function(el, data){
				mountExternal(
					'recaptcha_settings',
					el,
					data.session,
					<MountPoint>
						<CaptchaSettings {...data.payload}/>
					</MountPoint>
				);
			}
		}
		return settings;
	}
);
