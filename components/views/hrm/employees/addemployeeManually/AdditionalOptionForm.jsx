import React, { useContext } from 'react';

import { __, isEmpty, trimTextMiddle } from 'crewhrm-materials/helpers.jsx';
import { InstantSearch } from 'crewhrm-materials/instant-search.jsx';
import { FileUpload } from 'crewhrm-materials/file-upload/file-upload.jsx';

import { ContextAddEmlpoyeeManually } from './index.jsx';
import AddEmployeeCss from './AddManually.module.scss';
import EmployeeIndexCss from '../index.module.scss';

const doc_types = {
	employee_documents: __('Documents'),
	employee_trainings: __('Training')
}

export default function AdditionalOptionForm() {
	const { onChange, values={} } = useContext(ContextAddEmlpoyeeManually);

	const addDocument=(name, result, remove=false)=>{

		const results = Array.isArray(result) ? result : [result];
		const docs = values[name] || [];
		
		results.forEach(result=>{
			if ( remove ) {
				docs.splice(docs.findIndex(d=>d.id==result.id), 1);
			} else if ( ! docs.find(d=>d.id==result.id) ) {
				docs.push({
					id: result.id,
					label: result.label,
					permalink: result.permalink
				});
			}
		});
		
		onChange(name, docs);
	}

	const addFromMediaPicker=(name, files)=>{
		addDocument(
			name,
			files.map(({file_id: id, file_name: label, file_url: permalink})=>{
				return {id, label, permalink}
			})
		);
	}

	return (
		<>
			<div className={'employeeinfo-form-wrapper'.classNames(AddEmployeeCss)}>
				{
					Object.keys(doc_types).map((type, index)=>{
						return <div key={type} className={`${index>0 ? 'margin-top-30' : ''}`.classNames() + `employeeinfo-form`.classNames(AddEmployeeCss)}>
							<div className={'d-flex'.classNames()}>
								<div className={'flex-1'.classNames()}>
									<div className={'color-text font-size-20 line-height-24 font-weight-500'.classNames()}>
										{doc_types[type]}
									</div>
								</div>
								<FileUpload
									maxlength={1000}
									WpMedia={{mime_type: ['application/pdf', 'video/*']}}
									onChange={files=>addFromMediaPicker(type, files)}
									layoutComp={({onClick})=>{
										return <div
											className={'d-flex align-items-center justify-content-end column-gap-5 cursor-pointer'.classNames()}
											onClick={onClick}
										>
											<i
												className={'ch-icon ch-icon-folder-add font-size-20 color-text cursor-pointer'.classNames()}
												onClick={() => null}
												style={{ color: '#236BFE' }}
											></i>
											<div
												className={'color-primary font-size-15 line-height-18 font-weight-500'.classNames()}
												style={{ color: '#236BFE' }}
											>
												{__('Upload')}
											</div>
										</div>
								}}/>
							</div>
							<div className={'d-flex margin-top-15'.classNames()}>
								<div className={'flex-1'.classNames()}>
									<InstantSearch
										onAdd={result=>addDocument(type, result)}
										placeholder={__('ex. Onboarding Guideline')}
										args={{
											source: 'media', 
											exclude: (values[type] || []).map(m=>m.media_id)
										}}
									/>
								</div>
							</div>
							{
								isEmpty(values[type]) ? null :
								<div className={'d-flex flex-wrap-wrap column-gap-10 row-gap-10 margin-top-15'.classNames()}>
									{
										values[type].map(media=>{
											return <div
												key={media.id}
												className={
													'd-flex align-items-center column-gap-10 padding-horizontal-10 padding-vertical-5'.classNames() +
													'person-card width-max-content'.classNames(EmployeeIndexCss)
												}
											>
												<a 
													href={media.permalink} 
													target='_blank' 
													className={'color-text font-size-15 line-height-18 font-weight-500'.classNames()}
												>
													{trimTextMiddle(media.label, 30)}
												</a>
												<i
													className={'ch-icon ch-icon-times font-size-15 color-text cursor-pointer'.classNames()}
													onClick={() => addDocument(type, media, true)}
												></i>
											</div>
										})
									}
								</div>
							}
						</div>
					})
				}
			</div>
		</>
	);
}
