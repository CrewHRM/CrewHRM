import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { __, filterObject, filterUniqueColumn, parseParams } from 'crewhrm-materials/helpers.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { CoverImage } from 'crewhrm-materials/image/image.jsx';
import { CareersSidebar } from './sidebar.jsx';
import { CareersLoop } from './loop.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';

import style from './listing.module.scss';

export function Listing({ base_permalink, settings = {} }) {
    const [searchParam, setSearchParam] = useSearchParams();
    const queryParams = parseParams(searchParam);
    const current_page = parseInt( queryParams.page || 1 );

    const [state, setState] = useState({
        jobs: [],
        departments: [],
        loading: true,
        no_more: false
    });

    // Push the filters to URL state
    const setFilter = (key, value) => {
        const filters = typeof key === 'object' ? key : {
            ...queryParams,
            page: 1,
            [key]: value
        };

        setState({
            ...state,
            no_more: false
        });

        // Push the filters to search param
        setSearchParam(new URLSearchParams(filterObject(filters, (v) => v)).toString());
    };

    const getJobs = () => {
        setState({
            ...state,
            loading: true
        });

        request('getCareersListing', { filters: { page: 1, ...queryParams } }, (resp) => {
            const {
                data: { jobs = [], departments = [] }
            } = resp;

            // Build jobs array
            let jobs_combined = current_page > 1 ? [...state.jobs, ...jobs] : jobs;
            jobs_combined = filterUniqueColumn(jobs_combined, 'job_id');

            setState({
                ...state,
                jobs: jobs_combined,
                departments: departments,
                loading: false,
                no_more: !jobs.length
            });
        });
    };

    // When URL state changes, put the filters in state
    useEffect(() => {
        getJobs();
    }, [searchParam]);

    return (
        <>
            {settings.header ? (
                <div data-crew="careers-header">
                    <CoverImage
                        src={settings.hero_image_url}
                        style={{ minHeight: '355px' }}
                        className={'padding-15 text-align-center'.classNames()}
                    >
                        <span
                            className={'d-block font-size-38 font-weight-500 line-height-40 letter-spacing--38 color-white padding-vertical-50 margin-top-25 margin-bottom-25'.classNames()}
                        >
                            {settings.tagline}
                        </span>
                    </CoverImage>
                </div>
            ) : null}

            <div
                data-crew="job-listing"
                className={'listing'.classNames(style)}
                style={{ marginTop: '59px' }}
            >
                <Conditional show={settings.sidebar}>
                    <CareersSidebar
                        filters={queryParams}
                        setFilter={setFilter}
                        jobs_country_codes={settings.country_codes}
                        departments={state.departments}
                    />
                </Conditional>

                <div
                    data-crew="listing"
                    className={'content-area'.classNames(style) + 'flex-1'.classNames()}
                >
                    <Conditional show={settings.search}>
                        <TextField
                            placeholder={__('Search Keywords')}
                            iconClass={'ch-icon ch-icon-search-normal-1'.classNames()}
                            value={queryParams.search || ''}
                            onChange={(v) => setFilter( 'search', v )}
							inputDelay={300}
                        />
                    </Conditional>

                    <Conditional show={!state.loading && !state.jobs.length}>
                        <div
                            className={'text-align-center font-size-12 font-weight-500 letter-spacing--12 padding-15 color-text-light'.classNames()}
                        >
                            {__('No Job Found!')}
                        </div>
                    </Conditional>

					<Conditional show={state.jobs.length}>
						<div className={'font-size-12 font-weight-500 letter-spacing--12 padding-15 color-text-light'.classNames()}>
							{__('Jobs')}
						</div>
					</Conditional>
                    <CareersLoop jobs={state.jobs} base_permalink={base_permalink} />

                    <Conditional show={!state.no_more}>
                        <div
                            data-crew="loading"
                            className={'text-align-center'.classNames()}
                        >
                            <LoadingIcon show={state.loading} />
                            <div
                                className={`font-size-13 font-weight-400 line-height-21 color-text-light margin-top-8`.classNames()}
                            >
                                <span
                                    className={`${
                                        !state.loading ? 'cursor-pointer hover-underline' : ''
                                    }`.classNames()}
                                    onClick={() =>
                                        state.loading ? 0 : setFilter('page', current_page + 1)
                                    }
                                >
                                    {state.loading
                                        ? current_page > 1
                                            ? __('Loading More...')
                                            : __('Loading...')
                                        : __('Load More')}
                                </span>
                            </div>
                        </div>
                    </Conditional>
                </div>
            </div>
        </>
    );
}
