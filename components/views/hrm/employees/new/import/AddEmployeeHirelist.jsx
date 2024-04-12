import React, { useContext, useEffect, useState } from 'react';

import { __, data_pointer, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { StickyBar } from 'crewhrm-materials/sticky-bar.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import imgsrc from 'crewhrm-materials/static/images/addemployee-img-subscribe-5.png';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';

import EmployeeIndexCss from '../../index.module.scss';
import employeecss from './../employee.module.scss';

import style from './import.module.scss';

export default function AddEmployeeHirelist() {

	const {ajaxToast} = useContext(ContextToast);
	
	const [state, setState] = useState({
		loading_jobs: true,
		loading_applications: false,
		adding: false,
		selected_job: null,
		selected_applications: [],
		job_list: [],
		applications: []
	});

	const getJobs=()=>{

		setState({
			...state,
			loading_jobs: true
		});

		request('getJobsDashboardMinimal', {}, resp=>{
			const {
				data: {
					jobs=[]
				}
			} = resp;

			setState({
				...state,
				loading_jobs: false,
				job_list: jobs
			})
		});
	}

	const getHiredList=()=>{

		if ( ! state.selected_job ) {
			setState({
				...state,
				applications: [],
				selected_applications: []
			});
			return;
		}

		setState({
			...state,
			loading_applications: true
		});

		request('getApplicationsByJob', {job_id: state.selected_job}, resp=>{
			const {
				data: {
					applications = []
				}
			} = resp;

			setState({
				...state,
				loading_applications: false,
				applications
			});
		});
	}

	const addAsEmployee=()=>{
		
		const {
			selected_applications: application_ids,
			selected_job: job_id
		} = state;

		setState({
			...state,
			adding: true
		});

		/* request('importApplicationAsEmployee', {application_ids, job_id}, resp=>{
			setState({
				...state,
				adding: false
			});
			ajaxToast(resp);
		}); */
	}

	const toggleSelection=(application_id, add)=>{
		
		const {selected_applications=[]} = state;
		const index = selected_applications.indexOf(application_id);

		if (add) {
			if ( index === -1 ) {
				selected_applications.push(application_id)
			}
		} else {
			selected_applications.splice(index, 1);
		}

		setState({...state, selected_applications});
	}

	useEffect(()=>{
		getJobs();
	}, []);

	useEffect(()=>{
		getHiredList();
	}, [state.selected_job]);

	return <>
		<StickyBar title={__('People Hirelist')} canBack={true}>
			<div className={'d-flex align-items-center column-gap-30'.classNames()}>
				<div className={'d-inline-block'.classNames()}>
					<a
						href={`${window[data_pointer].admin_url}=${window[data_pointer].app_name}#/dashboard/jobs/editor/new/`}
						className={'button button-primary'.classNames()}
					>
						{__('Update')}
					</a>
				</div>
			</div>
		</StickyBar>
		<div
			className={
				'employee-invitation-wrapper'.classNames(employeecss) + 'padding-horizontal-50'.classNames()
			}
		>
			<div
				className={
					'd-flex flex-direction-column align-items-center margin-bottom-30'.classNames()
				}
			>
				<img className={'margin-bottom-15'.classNames()} src={imgsrc} />
				<div className={'font-size-24 font-weight-600 line-height-32 color-text'.classNames()}>
					{__('Select from the hire list')}
				</div>
				<div
					className={'font-size-15 font-weight-400 line-height-25 margin-bottom-10 text-align-center color-text-light'.classNames()}
				>
					{__('Pick a job post and a newly hired member.')}
				</div>
			</div>
			{
				state.loading_jobs ?
					<LoadingIcon show={state.loading_jobs} center={true}/>
					:
					(
						isEmpty(state.job_list) ?
							<div className={'text-align-center color-error'.classNames()}>
								{__('No job found to import employee from')}
							</div>
							:
							<div className={'employee-invitation-area'.classNames(employeecss)}>
								<div className={'employee-invitationlist-dropdown'}>
									<DropDown
										value={state.selected_job}
										placeholder="Select job post"
										onChange={(v) => {
											setState({...state, selected_job: v});
										}}
										options={state.job_list.map((job) => {
											return { 
												id: job.job_id, 
												label: job.job_title 
											}
										})}
									/>
								</div>

								{
									state.loading_applications ?
										<LoadingIcon show={state.loading_applications} center={true}/>
										:
										(
											isEmpty(state.applications) ?
												<div className={'margin-top-20'.classNames()}>
													{
														state.selected_job ? 
														<div className={'text-align-center color-error'.classNames()}>
															{__('No application found in this job')}
														</div>
														:
														<div className={'text-align-center'.classNames()}>
															{__('Please select a job to import from')}
														</div>
													}
												</div>
												:
												<div
													className={
														'employee-invitation-employeelist'.classNames(style) +
														'margin-top-20'.classNames()
													}
												>
													{
														state.applications.map(application=>{

															const {
																application_id, 
																first_name, 
																last_name, 
																email
															} = application;

															const selected = state.selected_applications.indexOf(application_id) > -1;

															return <div
																key={application_id}
																className={
																	`each-employee ${selected ? 'selected' : ''}`.classNames(style) +
																	'crew-hrm-border'.classNames(EmployeeIndexCss)
																}
															>
																<div className={'each-employee-info'.classNames(style)}>
																	{/* <div className={'each-employee-propic'.classNames(style)}>
																		<img src={propic} alt="profile image" />
																	</div> */}
																	<div className={'each-employee-info-details'.classNames(style)}>
																		<div
																			className={
																				'each-employee-info-name'.classNames(style) +
																				'font-size-15 font-weight-500 line-height-20 color-text'.classNames()
																			}
																		>
																			{first_name} {last_name}
																		</div>
																		<div
																			className={
																				'each-employee-info-email'.classNames(style) +
																				'color-text-light font-size-13 font-weight-400 line-height-20'.classNames()
																			}
																		>
																			{email}
																		</div>
																	</div>
																</div>
																{
																	!selected ?
																		<div 
																			className={'each-employee-action-icon'.classNames(style)}
																			onClick={()=>toggleSelection(application_id, true)}
																		>
																			<span></span>
																			<span className={'for-plus'.classNames(style)}></span>
																		</div>
																		:
																		<div
																			className={
																				'each-employee-action-icon'.classNames(style) +
																				'each-employee-action-icon-minus'.classNames(style)
																			}
																			onClick={()=>toggleSelection(application_id, false)}
																		>
																			<span></span>
																		</div>
																}
															</div>
														})
													}
												</div>
										)
								}
								
								{
									isEmpty(state.applications) ? null :
									<button
										disabled={!state.selected_applications.length}
										className={'button button-primary button-large margin-top-20 text-align-center'.classNames()}
										onClick={addAsEmployee}
									>
										{__('Add as Employee')}
									</button>
								}
							</div>
					)
			}
		</div>
	</>
}
