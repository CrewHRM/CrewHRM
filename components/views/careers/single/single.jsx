import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { __, formatDate, getAddress, getLocalFromUnix, parseParams } from 'crewhrm-materials/helpers.jsx';
import { DangerouslySet } from 'crewhrm-materials/dangerously-set.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { LoadingIcon } from 'crewhrm-materials/loading-icon/loading-icon.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { statuses, employment_types, salary_types } from 'crewhrm-materials/data.jsx';
import { applyFilters } from 'crewhrm-materials/hooks.jsx';

import { sections_fields } from '../../hrm/job-editor/application-form/form-structure.jsx';
import { Apply } from './apply/apply.jsx';

import style from './single.module.scss';

const getForm = (_form, attrs) => {
    // Loop through fields
    for (let i = 0; i < _form.length; i++) {
        // Recursive, though there are only two level ideally
        if (Array.isArray(_form[i])) {
            _form[i] = getForm(_form[i], attrs);
            continue;
        }

        _form[i] = { ..._form[i], ...attrs };
    }

    return _form;
};

/**
 * 
 * @param {string} category The field category like personal, questions etc.
 * @param {object} field The field to add input field structure from hard coded sections.
 * @returns {object}
 */
const prepareField = (category, field = {}) => {
    let { form: _form = [] } = sections_fields[category].fields.find((f) => f.id === field.id) || {};
    const { required, enabled, readonly, accept } = field;

    let attrs = {
        required: required || readonly,
        enabled: enabled || readonly,
		accept
    };

    return getForm(_form, attrs);
};

/**
 * 
 * @param {object} fields 
 * @returns {object} The prepared fields object
 */
function applyFormFields(fields) {
    return applyFilters(
		'crewhrm_application_form_fields', 
		{
			personal: fields.personal_info.fields
				.map((f) => prepareField('personal_info', f))
				.filter((f) => f)
				.flat(),

			documents: fields.documents.fields
				.map((f) => prepareField('documents', f))
				.filter((f) => f)
				.flat(),

			other: [
				...fields.profile.fields
					.map((f) => prepareField('profile', f))
					.filter((f) => f)
					.flat()
			]
		},
		fields
	);
}

function RenderMeta({ icon, hint, content, afterContent='', contentClass='' }) {
    return content ? (
        <div>
            <i className={`${icon} font-size-16 color-text-light`.classNames()}></i>
            <span
                className={'d-block font-size-13 font-weight-500 line-height-25 color-text-light margin-top-8 margin-bottom-2'.classNames()}
            >
                {hint}
            </span>
            <span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames() + contentClass}>
                {content} {afterContent}
            </span>
        </div>
    ) : null;
}

export function Single({ base_permalink, settings={} }) {
    const { job_action, job_slug } = useParams();
    const [searchParam, setSearchParam] = useSearchParams();
    const queryParams = parseParams(searchParam);

    const [state, setState] = useState({
        job: null,
        about_company: null,
		social_links: [],
        fetching: true,
        error_message: null
    });

    const getJob = () => {
        setState({
            ...state,
            fetching: true
        });

        request('getSingleJobView', { job_slug, preview: queryParams.preview }, (resp) => {
            const {
                success,
                data: { 
					job = {}, 
					about_company={}, 
					social_links=[],
					message = __('Something Went Wrong!') 
				}
            } = resp;

            setState({
                ...state,
                job: {
                    ...job,
                    application_form: success ? applyFormFields(job.application_form || {}) : null
                },
                about_company,
				social_links,
                fetching: false,
                error_message: !success || !job ? message : null
            });
        });
    };

    useEffect(() => {
        getJob();
    }, [job_slug]);

    const {
        department_name,
        job_title,
        job_status,
        job_description,
        employment_type,
        salary_a,
        salary_b,
		salary_basis,
		currency=''
    } = state.job || {};

    if (state.fetching) {
        return <LoadingIcon center={true} />;
    }

    if (state.error_message) {
        return (
            <div className={'text-align-center color-error'.classNames()}>
                {state.error_message}
            </div>
        );
    }

    return job_action === 'apply' ? <Apply 
		job={state.job} 
		settings={settings} 
		social_links={state.social_links}/> 
	:
	<div className={'single'.classNames(style)}>
		<Helmet>
			<title>{job_title}</title>
		</Helmet>
		<div className={'header'.classNames(style) + 'bg-color-tertiary'.classNames()}>
			<div className={'container'.classNames(style)}>
				<span
					className={'d-block font-size-15 font-weight-700 line-height-25 letter-spacing-3 color-text margin-bottom-10'.classNames()}
				>
					{department_name}
				</span>
				<span
					className={'d-block font-size-38 font-weight-600 line-height-40 letter-spacing--38 color-text'.classNames()}
				>
					{job_title}
					<Conditional show={job_status !== 'publish'}>
						&nbsp; <i>( {statuses[job_status]?.label ?? job_status} )</i>
					</Conditional>
				</span>
			</div>
		</div>
		<div className={'details'.classNames(style)}>
			<div className={'container'.classNames(style)}>
				<div
					className={'d-flex align-items-center justify-content-space-between flex-wrap-wrap column-gap-20 row-gap-20 padding-vertical-20 padding-horizontal-30 bg-color-white border-radius-10 box-shadow-thick'.classNames()}
					style={{ marginTop: '-51px', marginBottom: '79px' }}
				>
					<RenderMeta
						icon={'ch-icon ch-icon-location'}
						hint={__('Location')}
						content={getAddress(state.job || {})}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-briefcase-2'}
						hint={__('Job Type')}
						contentClass={'white-space-nowrap'.classNames()}
						content={employment_types[employment_type]}
					/>
					<RenderMeta
						icon={'ch-icon ch-icon-empty-wallet'}
						hint={__('Salary')}
						content={(salary_a || '') + (salary_b ? '-' + salary_b : '')}
						afterContent={(currency || '') + ' ' + (salary_types[salary_basis] ? ' / ' + salary_types[salary_basis] : '')}
						contentClass={'white-space-nowrap'.classNames()}
					/>
					<div className={'align-self-center'.classNames()}>
						<Link
							to={`/${base_permalink}/${job_slug}/apply/`}
							className={'button button-primary'.classNames()}
						>
							{__('Apply Now')}
						</Link>
					</div>
				</div>

				{state.about_company ? (
					<div className={'margin-bottom-32'.classNames()}>
						<span
							className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
						>
							{__('About Company')}
						</span>
						<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
							{state.about_company}
						</DangerouslySet>
					</div>
				) : null}

				{job_description ? (
					<div className={'margin-bottom-32'.classNames()}>
						<span
							className={'d-block font-size-17 font-weight-600 line-height-24 color-black margin-bottom-12'.classNames()}
						>
							{__('Job Description')}
						</span>
						<DangerouslySet className={'font-weight-400 color-black'.classNames()}>
							{job_description}
						</DangerouslySet>
					</div>
				) : null}

				<Conditional show={state.job.application_deadline}>
					<div className={'margin-bottom-32'.classNames()}>
						<i>{__('Application Deadline:')} {formatDate(getLocalFromUnix(state.job.application_deadline))}</i>
					</div>
				</Conditional>

				<div>
					<Link
						to={`/${base_permalink}/${job_slug}/apply/`}
						className={'button button-primary button-full-width'.classNames()}
					>
						{__('Apply Now')}
					</Link>
				</div>
			</div>
		</div>
	</div>
}
