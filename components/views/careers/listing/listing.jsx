import React, { useEffect, useState } from 'react';

import { __, filterUniqueColumn } from '../../../utilities/helpers.jsx';
import { LoadingIcon } from '../../../materials/loading-icon/loading-icon.jsx';
import { TextField } from '../../../materials/text-field/text-field.jsx';
import { CoverImage } from '../../../materials/image/image.jsx';
import { CareersSidebar } from './sidebar.jsx';
import { CareersLoop } from './loop.jsx';

import style from './listing.module.scss';
import { request } from '../../../utilities/request.jsx';
import { Conditional } from '../../../materials/conditional.jsx';

export function Listing({ base_permalink, settings={} }) {
    const [state, setState] = useState({
        filters: {
			search: '',
			page: 1,
			limit: 1,
			department: null,
			attendance_type: null,
			country_code: null,
			employment_type: null,
		},
		filter_list: [],
        jobs: [],
		loading: true,
		no_more: false
    });

	const [searchState, setSearchState] = useState('');

    const setFilter = (key, value) => {
        setState({
            ...state,
			no_more: false,
            filters: {
                ...state.filters,
				page: 1,
                [key]: value
            }
        });
    };

	const getJobs=()=>{
		setState({
			...state,
			loading: true
		});

		request('get_careers_listing', {filters: state.filters}, resp=>{
			const {data: {jobs=[]}} = resp;

			// Build jobs array
			let jobs_combined = state.filters.page>1 ? [...state.jobs, ...jobs] : jobs;
			jobs_combined = filterUniqueColumn( jobs_combined, 'job_id' );

			setState({
				...state,
				jobs: jobs_combined,
				loading: false,
				no_more: !jobs.length
			});
		});
	}

	useEffect(()=>{
		getJobs();
	}, [state.filters]);

	useEffect(()=>{
		const timer = window.setTimeout(()=>{
			setFilter('search', searchState);
		}, 500);

		return ()=>window.clearTimeout(timer);
		
	}, [searchState]);

    return (
        <>
			{
				settings.header ? <div data-crewhrm-selector="careers-header">
					<CoverImage
						src={settings.hero_image_url}
						style={{ minHeight: '355px' }}
						className={'padding-15 text-align-center'.classNames()}
					>
						<span
							className={'d-block font-size-38 font-weight-500 line-height-24 letter-spacing--38 color-white padding-vertical-50 margin-top-25 margin-bottom-25'.classNames()}
						>
							{settings.tagline}
						</span>
					</CoverImage>
				</div> : null
			}
            
            <div
                data-crewhrm-selector="job-listing"
                className={'listing'.classNames(style)}
                style={{ marginTop: '59px' }}
            >
				<Conditional show={settings.sidebar}>
					<CareersSidebar 
						filters={state.filters}
						setFilter={setFilter} 
						filterList={state.filter_list}
						jobs_country_codes={settings.country_codes}/>
				</Conditional>
				
                <div
                    data-crewhrm-selector="listing"
                    className={'content-area'.classNames(style) + 'flex-1'.classNames()}
                >
					<Conditional show={settings.search}>
						<TextField
							placeholder={__('Search Keywords')}
							iconClass={'ch-icon ch-icon-search-normal-1'.classNames()}
							value={searchState}
							onChange={v=>setSearchState(v)}
							className={'padding-vertical-10 padding-horizontal-11 border-1 b-color-tertiary b-color-active-primary border-radius-5'.classNames()}
						/>
					</Conditional>
					
					<CareersLoop 
						jobs={state.jobs} 
						base_permalink={base_permalink}/>

					<Conditional show={!state.no_more}>
						<div
							data-crewhrm-selector="loading"
							className={'text-align-center'.classNames()}
						>
							<LoadingIcon show={state.loading}/>
							<div
								className={`font-size-13 font-weight-400 line-height-21 color-text-light margin-top-8`.classNames()}
							>
								<span 
									className={`${!state.loading ? 'cursor-pointer hover-underline' : ''}`.classNames()} 
									onClick={()=>state.loading ? 0 : setFilter('page', state.filters.page+1)}
								>
									{state.loading ? (state.filters.page>1 ? __('Loading More...') : __('Loading...')) : __('Load More')}
								</span>
							</div>
						</div>
					</Conditional>
                </div>
            </div>
        </>
    );
}
