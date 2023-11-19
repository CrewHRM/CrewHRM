import React, { useState } from 'react';
import { TagField } from 'crewhrm-materials/tag-field/tag-field.jsx';
import { __, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { countries_object, employment_types } from 'crewhrm-materials/data.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';

import style from './listing.module.scss';

function Filters({_setFilter, filterList, filters}) {
	return Object.keys(filterList).map((filter_key) => {
		let { section_label, selection_type, options = [] } = filterList[filter_key];

		return options.length ? (
			<div
				key={filter_key}
				className={'margin-bottom-23 overflow-auto'.classNames()}
			>
				<span
					className={'d-block font-size-14 font-weight-700 line-height-24 letter-spacing--14 color-text-light margin-bottom-16 text-transform-uppercase'.classNames()}
				>
					{section_label}
				</span>

				{selection_type == 'list'
					? options.map((option) => {
							let { id, label, count } = option;
							let is_active = filters[filter_key] == id;
							return (
								<span
									key={id}
									className={`d-block font-size-14 cursor-pointer margin-bottom-18 font-weight-500 ${is_active ? 'color-text' : 'color-text-light'}`.classNames()}
									onClick={() => _setFilter(filter_key, id)}
								>
									{label} {count ? `(${count})` : null}
								</span>
							);
						})
					: null}

				{selection_type == 'tag' ? (
					<div>
						<TagField
							theme="tag"
							behavior="radio"
							options={options}
							value={filters[filter_key]}
							onChange={(v) => _setFilter(filter_key, v)}
						/>
					</div>
				) : null}
			</div>
		) : null;
	})
}

function MobileFilter({_setFilter, filterList, filters}) {
	
	const [filter, setFilter] = useState(null);

	return <div className={'mobile-filter'.classNames(style)}>
		{
			!filter ? null : <div className={'mobile-popup'.classNames(style)} onClick={()=>setFilter(null)}>
				<div onClick={e=>e.stopPropagation()}>
					<div className={'header-bar'.classNames(style) + 'd-flex align-items-center column-gap-20'.classNames()}>
						<div className={'flex-1'.classNames()}>
							<strong className={'font-size-18 font-weight-700 line-height-24 letter-spacing--18 color-text'.classNames()}>
								{filter===true ? __('Filter') : filterList[filter].section_label}
							</strong>
						</div>
						<span 
							className={'color-secondary font-size-16 font-weight-500 line-height-24 letter-spacing--16  cursor-pointer'.classNames()}
							onClick={()=>{
								_setFilter({});
								setFilter(null);
							}}
						>
							{__('Reset')}
						</span>
						<i 
							className={'ch-icon ch-icon-times font-size-20 color-text-lighter cursor-pointer'.classNames()} 
							onClick={()=>setFilter(null)}></i>
					</div>
					<div className={'filters'.classNames(style)}>
						<Filters {...{
							_setFilter, 
							filters, 
							filterList: filter===true ? filterList : {[filter]: filterList[filter]}
						}}/>
					</div>
				</div>
			</div>
		}

		<div className={'d-flex align-items-center column-gap-10'.classNames()}>
			<div 
				className={`filter-control ${Object.keys(filters).length>1 ? 'has-change' : ''}`.classNames(style)} 
				onClick={()=>setFilter(true)}
			>
				<i className={'ch-icon ch-icon-candle font-size-20'.classNames()}></i>
			</div>
			{
				Object.keys(filterList).map((filter_key) => {
					const { section_label, selection_type, options = [] } = filterList[filter_key];
					const has_change = ! isEmpty( filters[filter_key] );
					const selected_label = has_change ? filterList[filter_key].options.find(o=>o.id==filters[filter_key])?.label : null;

					return !options.length ? null : <div 
						key={filter_key} 
						className={`option-name ${has_change ? 'has-change' : ''}`.classNames(style)}
						onClick={()=>setFilter(filter_key)}
					>
						<span className={'font-size-14 font-weight-500 line-height-24 letter-spacing--14'.classNames()}>
							{selected_label || section_label}
						</span>
						<i className={'ch-icon ch-icon-arrow-down font-size-20 vertical-align-middle margin-left-10'.classNames()}></i>
					</div>
				})
			}
		</div>
	</div>
}

export function CareersSidebar({ is_mobile, setFilter, filters, jobs_country_codes = [], departments = [] }) {
    const filterList = {
        department_id: {
            section_label: __('Departments'),
            selection_type: 'list',
            options: departments.map((d) => {
                return {
                    id: d.department_id,
                    label: d.department_name,
                    count: d.job_count
                };
            })
        },
        country_code: {
            section_label: __('Location'),
            selection_type: 'tag',
            options: jobs_country_codes.map((code) => {
                return {
                    id: code,
                    label: countries_object[code]
                };
            })
        },
        employment_type: {
            section_label: 'Job Type',
            selection_type: 'list',
            options: Object.keys(employment_types).map((type) => {
                return {
                    id: type,
                    label: employment_types[type]
                };
            })
        }
    };

    const _setFilter = (name, value) => {
        setFilter(name, filters[name] == value ? null : value);
    };

	const prop_drill = {
		_setFilter, 
		filterList, 
		filters
	}

    return (
        <div data-crew="sidebar" className={'sidebar'.classNames(style)}>
            <div>
				{is_mobile? <MobileFilter  {...prop_drill}/> : <Filters {...prop_drill}/>}
				
				<Conditional show={!is_mobile && Object.keys(filters).length>1}>
					<span 
						className={'d-flex align-items-center column-gap-6 font-size-14 color-text-light color-hover-text cursor-pointer'.classNames()} 
						onClick={()=>setFilter({})} 
						style={{marginLeft: '-3px'}}
					>
						<i className={'ch-icon ch-icon-times font-size-18'.classNames()}></i> {__('Clear Filters')}
					</span>
				</Conditional>
            </div>
        </div>
    );
}
