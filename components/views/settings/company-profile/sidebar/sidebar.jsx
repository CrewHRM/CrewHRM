import React from 'react';
import { __ } from '../../../../utilities/helpers.jsx';
import { Link, useParams } from 'react-router-dom';

export const pages = [
    {
        id: 'profile',
        permalink: '/company/profile/',
        label: __('Company Info'),
        icon: 'ch-icon ch-icon-building-4'
    },
    {
        id: 'departments',
        permalink: '/company/departments/',
        label: __('Departments'),
        icon: 'ch-icon ch-icon-hierarchy'
    }
];

export function CompanyProfileSidebar({ page_id: sub_page }) {
    return (
        <div
            data-crewhrm-selector="company-profile-sidebar"
            className={'d-flex flex-direction-column margin-right-50'.classNames()}
        >
			<div className={'d-flex flex-direction-column row-gap-25 position-sticky'.classNames()} style={{top: '120px'}}>
				{pages.map((page) => {
					const { id: page_id, permalink, label, icon } = page;
					const is_active = sub_page === page_id;

					return (
						<Link
							key={page_id}
							to={permalink}
							className={'d-flex align-items-center column-gap-10 color-hover-parent'.classNames()}
						>
							<span className={'d-inline-block width-24'.classNames()}>
								<span
									className={
										icon.classNames() +
										`font-size-24 ${
											is_active ? 'color-secondary' : 'color-text-light'
										} color-hover-child-secondary`.classNames()
									}
								></span>
							</span>
							<span
								className={`font-size-15 font-weight-500 line-height-25 ${
									is_active ? 'color-text' : 'color-text-light'
								} color-hover-child-primary`.classNames()}
							>
								{label}
							</span>
						</Link>
					);
				})}
			</div>
        </div>
    );
}
