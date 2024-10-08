import React, { useContext, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { Tabs } from 'crewhrm-materials/tabs/tabs.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { countries_object, patterns } from 'crewhrm-materials/data.jsx';
import { Slot } from 'crewhrm-materials/mountpoint.jsx';
import {
	__,
	getAddress,
	isEmpty,
	filterObject,
	flattenArray,
	addKsesPrefix
} from 'crewhrm-materials/helpers.jsx';

import { RenderField } from './apply-form.jsx';
import { Applied } from '../applied/applied.jsx';

import style from './apply.module.scss';

export function Apply({ job = {}, settings = {}, social_links = [] }) {

	const {
		job_id,
		job_title,
		application_form: fields = {}
	} = job;

	const steps = [
		{
			id: 'personal',
			label: __('Personal Information')
		},
		{
			id: 'documents',
			label: __('Documents')
		},
		{
			id: 'other',
			label: __('Other Information')
		}
	].filter(step => !isEmpty(fields[step.id]?.filter(f => f.enabled)));

	const [state, setState] = useState({
		active_tab: 'personal',
		submitted: false,
		submitting: false,
		error_message: null,
		showErrorsAlways: false,
		values: {
			job_id
		}
	});

	const { addToast, ajaxToast } = useContext(ContextToast);

	const phoneUtil = PhoneNumberUtil.getInstance();

	const wrapper = useRef();
	const step_index = steps.findIndex((s) => s.id === state.active_tab);
	const step = steps[step_index];
	const is_segment = settings.form_layout !== 'single_form';
	const is_last_tab = step_index >= steps.length - 1;

	// Determine which fields to render, whether segmented or alltogether
	const fields_to_render = is_segment
		? fields[state.active_tab]
		: Object.keys(fields)
			.map((key) => fields[key])
			.flat();

	const onChange = (name, v) => {
		setState({
			...state,
			selectedCountry: name === 'country_code' ? v.toLowerCase() : state.selectedCountry,
			values: {
				...state.values,
				[name]: v,
				country_name: name === 'country_code' ? countries_object[v] : state.values.country_name
			}
		});
	};

	const navigateTab = (to) => {
		let index = steps.findIndex((s) => s.id === state.active_tab);

		if (to === -1) {
			if (index > 0) {
				// Navigate to previous tab
				index -= 1;
			} else {
				// Navigate to previous page as the tab is the first one
				window.history.back();
				return;
			}
		}

		if (to === 1) {
			// Navigate to next tab. This function will not be called on last, so check is not necessary.
			index += 1;
		}

		setState({
			...state,
			active_tab: typeof to === 'string' ? to : steps[index].id,
			showErrorsAlways: false
		});
	};

	const uploadApplicationFiles = (application_id, files = []) => {
		if (!files.length) {
			setState({
				...state,
				submitted: true,
				submitting: false
			});
			return;
		}

		const file = files.shift();
		const payload = {
			application_id,
			field_name: file.name,
			file: file.file,
			finalize: !files.length
		}

		request('uploadApplicationFile', payload, resp => {
			const { success } = resp;

			if (success) {
				uploadApplicationFiles(application_id, files);
				return;
			}

			ajaxToast(resp);
		});
	}

	const goNext = () => {
		// Check if is next enabled or not first
		if (!isNextEnabled(flattenArray(fields_to_render))) {

			// Highlight all the fields as error if submit button clicked.
			setState({
				...state,
				showErrorsAlways: true
			});

			// Scroll to top, so user can scroll down and see where are the errors
			if (wrapper?.current) {
				wrapper.current.scrollIntoView(true);
			}

			return;
		}

		if (is_segment) {
			// If segmented forms, go to next step or submit if it is already last
			if (is_last_tab) {
				submitApplication()
			} else {
				navigateTab(1);
			}
		} else {
			// If single form layout, just submit
			submitApplication();
		}
	}

	const submitApplication = () => {
		let payload = { application: state.values };
		const files = [];

		// Put files in different variable to upload separately one by one to obey max upload size limit.
		const _fields = Object.keys(fields).map((key) => fields[key]).flat();

		payload.application = filterObject(
			payload.application,
			function (value, name) {

				// Check if it is file input, if file, put the file array and return false to exclude from the textual data object
				if (_fields.find(_field => _field.name === name && _field.type === 'file')) {

					// If multiple file upload 
					if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i++) {
							files.push({
								name,
								file: value[i]
							});
						}

					} else {
						files.push({
							name,
							file: value
						});
					}

					// Return false to exclude from data object as it is file
					return false;
				}

				return true;
			}
		);

		setState({
			...state,
			submitting: true
		});

		// Change the key for cover letter to kses_cover_letter in favour of sanitization
		payload = addKsesPrefix(payload, 'cover_letter');

		request('applyToJob', { ...payload, finalize: !files.length }, (resp) => {
			const {
				success,
				data: { notice, message, application_id }
			} = resp;

			// If failed to submit application
			if (!success) {
				// Either notice or message is supposed to be in the response if the success is false.
				if (notice || !message) {
					// Minor notice that can be fixed
					addToast({
						message: notice || __('Submission failed. Something went wrong!'),
						status: 'error'
					});

					// Enable submit button as action failed with toast message
					setState({
						...state,
						submitting: false
					});

				} else {
					// Final notice that will hide the form and show the notice only.
					setState({
						...state,
						submitted: true,
						error_message: message
					});
				}
			} else {
				// This block means submitted successfully
				uploadApplicationFiles(application_id, files);
			}
		});
	};

	const isPhoneValid = (phone) => {
		try {
			return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
		} catch (error) {
			return false;
		}
	};

	const isNextEnabled = (fields = []) => {
		let _enabled = true;

		// Handle address field exceptionally as the singular fields are not defined in the object corectly in favour of reusing AddressFields component.
		const _address_index = fields.findIndex(f => f.name === 'address');
		if (_address_index > -1) {
			const { required } = fields[_address_index];
			fields.splice(_address_index, 1);

			fields.push({ name: 'street_address', required });
			fields.push({ name: 'city', required });
			fields.push({ name: 'province', required });
			fields.push({ name: 'zip_code', required });
			fields.push({ name: 'country_code', required });
		}

		// Loop through fields
		for (let i = 0; i < fields.length; i++) {
			// If it is already false, break the loop, no more check necessary
			if (!_enabled) {
				break;
			}

			const { name, required } = fields[i];
			const { regex: validate_pattern } = fields[i];
			const value = state.values[name];
			const is_empty = isEmpty(value);

			if (required && is_empty) {
				_enabled = false;
			}

			if (name === 'phone' && !isPhoneValid(value)) {
				_enabled = false;
			}

			// No need format check if it optional one is empty
			if (is_empty || !validate_pattern) {
				continue;
			}

			if (!validate_pattern.test(value.replace(/\s+/g, ' ').trim())) {
				_enabled = false;
			}
		}

		return _enabled;
	};

	if (state.submitted) {
		return <>
			<Helmet>
				<title>{state.error_message ? __('Submission failed!') : __('Application submitted!')}</title>
			</Helmet>
			<Applied error_message={state.error_message} social_links={social_links} />
		</>
	}

	return <div data-cylector="job-application" className={'apply'.classNames(style)} ref={wrapper}>
		<Helmet>
			<title>{job_title} - {__('Apply')}</title>
		</Helmet>
		<div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
			<div className={'container'.classNames(style) + 'padding-30'.classNames()}>
				<span
					className={'d-block font-size-24 font-weight-600 line-height-32 letter-spacing--24 color-text'.classNames()}
				>
					{job_title}
				</span>
				<span
					className={'d-block font-size-17 font-weight-500 line-height-25 color-text margin-bottom-10'.classNames()}
				>
					{getAddress(job)}
				</span>
			</div>
		</div>

		{is_segment && steps.length > 1 ?
			<div
				className={
					'sequence'.classNames(style) +
					'padding-vertical-20 box-shadow-thin margin-bottom-50'.classNames()
				}
			>
				<div>
					<Tabs
						active={state.active_tab}
						tabs={steps}
						theme="sequence"
						scrollIntoViewOnChange={true} />
				</div>
			</div> : null
		}

		<div data-cylector="job-application-form" className={'form'.classNames(style)}>
			{is_segment ?
				<span
					className={'d-block font-size-20 font-weight-600 color-text margin-bottom-30'.classNames()}
				>
					{step.label}
				</span>
				:
				<div className={'margin-top-48'.classNames()}>
					<span
						className={'d-block font-size-20 font-weight-600 color-text margin-bottom-8'.classNames()}
					>
						{__('Apply for this job')}
					</span>
					<span
						className={'d-block font-size-15 font-weight-400 line-height-24 color-text-light margin-bottom-30'.classNames()}
					>
						{__('Fields marked with * are required.')}
					</span>
				</div>
			}

			{fields_to_render.map((f, i) => (
				<div key={i} className={'margin-bottom-30'.classNames()}>
					<RenderField
						field={f}
						values={state.values}
						onChange={onChange}
						showErrorsAlways={state.showErrorsAlways}
						selectedCountry={state.selectedCountry} />
				</div>
			))}

			<Slot
				name="applicaion_submit_button"
				payload={{
					onChange,
					is_final_stage: !is_segment || is_last_tab
				}}
			>
				{is_segment ? (
					<div>
						<FormActionButtons
							onBack={() => navigateTab(-1)}
							onNext={goNext}
							disabledNext={state.submitting}
							disabledPrevious={state.submitting}
							loading={state.submitting}
							nextText={
								is_last_tab ? __('Submit Application') : __('Save & Continue')
							}
						/>
					</div>
				) : (
					<div>
						<button
							disabled={state.submitting}
							className={'button button-primary button-full-width'.classNames()}
							onClick={goNext}
						>
							{__('Submit Application')} <LoadingIcon show={state.submitting} />
						</button>
					</div>
				)}
			</Slot>
		</div>
	</div>
}
