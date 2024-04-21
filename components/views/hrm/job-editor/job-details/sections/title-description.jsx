import React, { useContext, useEffect, useState } from 'react';

import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { __, data_pointer, sprintf } from 'crewhrm-materials/helpers.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { CircularProgress } from 'crewhrm-materials/circular.jsx';
import { TextEditor } from 'crewhrm-materials/text-editor/text-editor.jsx';
import { Modal } from 'crewhrm-materials/modal.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';

import { field_label_class, section_title_class } from '../job-details.jsx';
import { ContextJobEditor } from '../../index.jsx';

import style from '../details.module.scss';

export function AddItemModal({ endpoint, closeModal, onAdd, item_label }) {
	
    const { ajaxToast } = useContext(ContextToast);
    const [state, setState] = useState({
        item_name: null,
		saving: false
    });

    const addNow = () => {
        const { item_name } = state;

		setState({
			...state,
			saving: true
		})

        request(endpoint, { item_name }, (resp) => {

			const {
				success, 
				data:{
					id, 
					items=[]
				}
			} = resp;

            if (success) {
                onAdd({ id, items });
				return;
            }
			
            ajaxToast(resp);
			setState({
				...state,
				saving: false,
			});
        });
    };

    return (
        <Modal>
            <span
                className={'d-block font-size-24 font-weight-600 color-text margin-bottom-20'.classNames()}
            >
                {sprintf(__('Add %s'), item_label)}
            </span>

            <div className={'padding-vertical-15'.classNames()}>
                <span
                    className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}
                >
                    {item_label}
                </span>

                <input
                    type="text"
                    className={'width-p-100 padding-15 border-1-5 b-color-tertiary b-color-active-primary border-radius-10 height-48 font-size-15 font-weight-400 line-height-25 color-text'.classNames()}
                    onChange={(e) =>{
						setState({
							...state, 
							item_name: e.currentTarget.value 
						})
					}}
                />
            </div>

            <div
                className={'d-flex align-items-center justify-content-end column-gap-21'.classNames()}
            >
                <span
                    className={'font-size-15 font-weight-500 letter-spacing--3 color-text-light cursor-pointer'.classNames()}
                    onClick={() => closeModal()}
                >
                    {__('Cancel')}
                </span>
                <button
                    className={'button button-primary'.classNames()}
                    onClick={() => addNow()}
                    disabled={!state.item_name}
                >
                    {__('Submit')} <LoadingIcon show={state.saving}/>
                </button>
            </div>
        </Modal>
    );
}

export function DepartmentDropDown({value, onChange, tabindex, showErrorsAlways=false, required=false}) {
	
	const {departments=[]} = window[data_pointer];

	const [state, setState] = useState({
		departments: departments,
		add_department: false
	});

    const toggleDepartmentModal = (show) => {
        setState({
            ...state,
            add_department: show
        });
    };

	return <>
		{
			!state.add_department ? null : 
			<AddItemModal 
				endpoint='addDepartment'
				item_label={__('Department')}
				closeModal={()=>toggleDepartmentModal(false)}
				onAdd={v=>{
					
					onChange(v.id);

					setState({
						...state,
						add_department: false,
						departments: v.items
					})
				}} 
			/>
		}

		<DropDown
			value={value}
			onChange={onChange}
			tabindex={tabindex}
			addText={__('Add Department')}
			textClassName={'font-size-17 font-weight-500 line-height-25 color-text-light'.classNames()}
			onAddClick={()=>toggleDepartmentModal(true)}
			showErrorsAlways={showErrorsAlways}
			required={required}
			options={state.departments.map(d=>{
				return {
					id: d.department_id, 
					label: d.department_name
				}
			})}
		/>
	</> 
}

export function TitleAndDescription() {
	
    const { values, onChange, session } = useContext(ContextJobEditor);

    const title_allowed_length = 200;
    const job_title_length = values.job_title?.length || 0;

	const [state, setState] = useState({
		slug_editor: false,
		job_slug: values.job_slug,
	});

	useEffect(()=>{
		setState({
			...state, 
			job_slug: values.job_slug
		});
	}, [values.job_slug]);

    return (
        <>
            {/* Form intro */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Title & Description')}</span>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <i
                        className={'ch-icon ch-icon-lamp-charge font-size-20 color-text margin-right-4 vertical-align-middle'.classNames()}
                    ></i>{' '}
                    <span className={'font-size-13 font-weight-400 color-text'.classNames()}>
                        {__('Tips')}
                    </span>
                </div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1'.classNames()}>
                            <span className={field_label_class}>
                                {__('Job Title')}
                                <span className={'color-error'.classNames()}>*</span>
                            </span>
                        </div>
                        <div className={'d-flex align-items-center'.classNames()}>
                            <CircularProgress
                                percentage={(job_title_length / title_allowed_length) * 100}
                            />
                            <span
                                className={'d-inline-block font-size-13 font-weight-500 line-height-21 color-text-light margin-left-5'.classNames()}
                            >
                                {title_allowed_length - job_title_length}
                            </span>
                        </div>
                    </div>
                    <div>
                        <TextField
                            iconClass={
                                (job_title_length &&
                                    'ch-icon ch-icon-times font-size-20 color-tertiary cursor-pointer'.classNames()) ||
                                null
                            }
                            icon_position="right"
                            placeholder={__('ex. Product designer, Account manager')}
                            value={values.job_title || ''}
                            onChange={(v) => onChange('job_title', v)}
                            maxLength={title_allowed_length}
                            onIconClick={(refocus) => {
                                onChange('job_title', '');
                                refocus();
                            }}
                        />

						{
							!values.job_slug ? null :
							<div 
								className={'d-flex align-items-center flex-wrap-wrap flex-direction-row column-gap-5'.classNames()}
								style={{margin: '8px 0 0', height: '34px'}}
							>
								<a 
									href={values.job_permalink} 
									target='_blank'
									className={'width-auto'.classNames()}
								>
									{window[data_pointer].permalinks.careers}{state.slug_editor ? null : <><strong>{values.job_slug}</strong>/</>}
								</a>

								{
									!state.slug_editor ? 
										<i 
											className={'ch-icon ch-icon-edit-2 cursor-pointer font-size-18'.classNames()}
											onClick={()=>setState({...state, slug_editor: true})}></i>
										:
										<>
											<TextField 
												style={{width: '170px', height: '30px'}}
												value={state.job_slug}
												autofocus={true}
												onChange={job_slug=>setState({...state, job_slug})}
											/>
											<button 
												className={'button button-primary button-outlined button-small'.classNames()}
												onClick={()=>{
													onChange('job_slug', state.job_slug, true);
													setState({...state, slug_editor: false})
												}}
											>
												{__('Save')}
											</button>
										</>
								}
							</div>
						}
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={field_label_class}>&nbsp;</span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__('Use common job titles for searchability')}
                    </span>
                </div>
            </div>

            {/* Department and internal job code */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <div className={'d-flex'.classNames()}>
                        <div className={'flex-1 margin-right-10'.classNames()}>
                            <span className={field_label_class}>
                                {__('Department')}
                                <span className={'color-error'.classNames()}>*</span>
                            </span>
							<DepartmentDropDown 
								value={values.department_id} 
								onChange={(v) => onChange('department_id', v)}
								tabindex={2}
							/>
                        </div>
                        <div className={'flex-1 margin-left-10'.classNames()}>
                            <span className={field_label_class}>{__('Internal Job code')}</span>
                            <TextField
                                placeholder={__('ex. 001')}
                                value={values.job_code || ''}
                                onChange={v => onChange('job_code', v)}
                            />
                        </div>
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>

            {/* Job Description* */}
            <span className={field_label_class}>
                {__('Job Description')}
                <span className={'color-error'.classNames()}>*</span>
            </span>
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <TextEditor
                        session={session}
                        onChange={(v) => onChange('job_description', v)}
                        value={values.job_description || ''}
                        placeholder={__('Enter your job description here; include key areas responsibility and specific qualification needed to perform the role.')}
                    />
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span
                        className={'d-block font-size-13 font-weight-400 color-text-light margin-bottom-36'.classNames()}
                    >
                        {__('Format into sections and lists to improve readability')}
                    </span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__(
                            'Avoid targeting specific demographics e.g. gender, nationality and age'
                        )}
                    </span>
                </div>
            </div>
        </>
    );
}
