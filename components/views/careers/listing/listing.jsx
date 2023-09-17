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

const job = {
    job_id: 1,
    job_title: 'Account Executive',
    location: 'London, England',
    job_type: 'Full Time',
    department: 'Design',
    salary: '34,000 - 44000 USD',
    job_description: `We are seeking a talented and experienced Senior AI/ML Engineer to join our dynamic team. In this role, you will play a pivotal role in designing, developing, and deploying cutting-edge AI and machine learning solutions that drive our products to new heights of innovation.
<br/>
<br/>
<div><strong>Responsibilities</strong></div>
<ul>
	<li>Lead the ideation, design, and implementation of AI/ML solutions that align with our product roadmap and business objectives.</li>
	<li>Collaborate with software engineers, data scientists, and domain experts to gather requirements and refine AI/ML models.</li>
	<li>Research, experiment, and implement state-of-the-art algorithms and techniques to improve product functionality and performance.</li>
	<li>Drive data collection, preprocessing, and feature engineering efforts to ensure high-quality input for AI models.</li>
</ul>

<br/>
<br/>
<div><strong>Qualifications</strong></div>
<ul>
	<li>Master's or Ph.D. in Computer Science, Machine Learning, or a related field.</li>
	<li>Proven track record of designing, implementing, and deploying AI/ML solutions in real-world applications.</li>
	<li>Proficiency in programming languages such as Python, and familiarity with AI/ML libraries like TensorFlow, PyTorch, or scikit-learn.</li>
	<li>Strong understanding of deep learning architectures, natural language processing, and/or computer vision.</li>
</ul>`
};

const jobs = Array(8)
    .fill(job)
    .map((j, i) => {
        return {
            ...j,
            job_id: j.job_id + i
        };
    });

const filterList = {
    department: {
        section_label: __('Departments'),
        selection_type: 'list',
        options: [
            {
                id: 1,
                label: 'Business Development',
                count: 2
            },
            {
                id: 2,
                label: 'Business Analytics/Operations',
                count: 5
            },
            {
                id: 3,
                label: 'Backend Engineer',
                count: 1
            },
            {
                id: 4,
                label: 'Brand & Marketing',
                count: 1
            },
            {
                id: 5,
                label: 'Copywriter',
                count: 1
            },
            {
                id: 6,
                label: 'Creative Director',
                count: 2
            },
            {
                id: 7,
                label: 'Data Science',
                count: 1
            }
        ]
    },
    location: {
        section_label: __('Location'),
        selection_type: 'tag',
        options: [
            {
                id: 'us',
                label: 'USA'
            },
            {
                id: 'ca',
                label: 'Canada'
            },
            {
                id: 'in',
                label: 'India'
            },
            {
                id: 'gr',
                label: 'Germany'
            },
            {
                id: 'cn',
                label: 'China'
            }
        ]
    },
    job_type: {
        section_label: 'Job Type',
        selection_type: 'list',
        options: [
            {
                id: 'full_time',
                label: 'Full Time'
            },
            {
                id: 'part_time',
                label: 'Part Time'
            }
        ]
    }
};

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
        jobs: [],
		loading: true,
		no_more: false
    });

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
                {/* settings.careers_sidebar ? <CareersSidebar setFilter={setFilter} filterList={filterList}/> : null */}

                <div
                    data-crewhrm-selector="listing"
                    className={'content-area'.classNames(style) + 'flex-1'.classNames()}
                >
					<Conditional show={settings.careers_search}>
						<TextField
							placeholder={__('Search Keywords')}
							iconClass={'ch-icon ch-icon-search-normal-1'.classNames()}
							onChange={v=>setFilter('')}
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
