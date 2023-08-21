import React from "react";
import { __ } from "../../../../utilities/helpers.jsx";
import { Link, useParams } from "react-router-dom";

const pages = [
	{
		id        : 'profile',
		permalink :  '/company/profile/',
		label     : __( 'Company Info' ),
		icon      : 'ch-icon ch-icon-building-4'
	},
	{
		id        : 'departments',
		permalink : '/company/departments/',
		label     : __( 'Departments' ),
		icon      : 'ch-icon ch-icon-hierarchy'
	}
];

export function CompanyProfileSidebar() {
	const {sub_page} = useParams();
	
	return <div className={'d-flex flex-flow-column row-gap-25 margin-right-50'.classNames()}>
		{pages.map(page=>{
			const {id: page_id, permalink, label, icon} = page;
			const is_active = sub_page === page_id;
			
			return <Link key={page_id} to={permalink} className={'d-flex align-items-center column-gap-10'.classNames()}>
				<span className={'d-inline-block width-24'.classNames()}>
					<span className={icon.classNames() + `font-size-24 ${is_active ? 'text-color-secondary' : 'text-color-light'}`.classNames()}></span>
				</span>
				<span className={`font-size-15 font-weight-500 line-height-25 ${is_active ? 'text-color-primary' : 'text-color-light'}`.classNames()}>
					{label}
				</span>
			</Link>
		})}
	</div>
}