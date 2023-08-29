import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';

import '../../utilities/prototypes.jsx';
import { __, getElementDataSet } from '../../utilities/helpers.jsx';
import { MountPoint } from '../../materials/mountpoint.jsx';
import { Listing } from './listing/listing.jsx';
import { Apply } from './apply/apply.jsx';
import { Single } from './single/single.jsx';

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

const about_company =
    'NexaTech Solutions is a cutting-edge technology company dedicated to revolutionizing industries through innovative software solutions. We specialize in developing advanced software products that empower businesses to streamline their operations, enhance customer experiences, and drive growth in the digital age. Our team is composed of passionate and driven individuals who are united by a shared commitment to pushing the boundaries of what technology can achieve.';

const filters = {
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

function Dispatcher() {
    const about_company = about_company;

    const { job_id, job_action } = useParams();
    const [state, setState] = useState({
        filters: {},
        jobs: jobs
    });

    const setFilter = (key, value) => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                [key]: value
            }
        });
    };

    if (job_id && job_action === 'apply') {
        return <Apply job={job} />;
    }

    if (job_id) {
        return <Single job={job} about_company={about_company} />;
    }

    return (
        <Listing
            jobs={state.jobs}
            setFilter={setFilter}
            filters={state.filters}
            filterList={filters}
        />
    );
}

function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/:job_id?/:job_action?/" element={<Dispatcher />} />
                <Route path={'*'} element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}

// Render company profile
const careers = document.getElementById('crewhrm_careers');
if (careers) {
    const data = getElementDataSet(careers);

    ReactDOM.createRoot(careers).render(
        <MountPoint element={careers} nonce={data.crewhrmNonce} nonceAction={careers.id}>
            <Router {...data} />
        </MountPoint>
    );
}
