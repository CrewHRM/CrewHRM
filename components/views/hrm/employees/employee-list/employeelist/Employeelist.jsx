import React, { useEffect, useState } from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { DropDown, Options } from 'crewhrm-materials/dropdown/dropdown';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { Pagination } from 'crewhrm-materials/pagination/pagination.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';

import EmployeelistCss from './employeelist.module.scss';
import Human from '../img/search-normal-add-8.svg';
import SearchImg from '../img/search-normal-add-8.svg';

const options = [
	{
		name: 'edit',
		label: __('Edit'),
		icon: 'ch-icon ch-icon-edit-2',
		for: ['publish', 'draft', 'expired'],
	},
	{
		name: 'share',
		label: __('Share Job'),
		icon: 'ch-icon ch-icon-share',
		for: ['publish'],
	},
	{
		name: 'delete',
		label: __('Delete'),
		icon: 'ch-icon ch-icon-trash',
		for: 'all',
		warning: __('Are you sure to delete permanently?'),
	},
];

export default function Employeelist() {
	const [textValue, setTextValue] = useState('');
	const [toggle, setToggle] = useState(true);
	const [isActivePopup, setIsActivePopup] = useState(false);
	const tableRow = new Array(10).fill(0);

	const [state, setState] = useState({
		filters: {
			search: '',
			page: 1
		}
	});

	const setFilter=(name, value)=>{
		const {filters={}} = state;
		setState({
			...state,
			filters: {
				...filters,
				[name]: value,
				page: name!=='page' ? 1 : state.filters.page // Reset page to the first to as it is new filter.
			}
		});
	}

	const fetchEmployees=()=>{

		request('getEmployeeList', {filters: state.filters}, resp=>{
			
			const {
				success= false,
				data: {
					employees: []
				}
			} = resp;

			
		} );
	}

	useEffect(()=>{
		fetchEmployees();
	}, [state.filters]);

	const actions = options.map((o) => {
		return {
			id: o.name,
			label: (
				<span className={'d-inline-flex align-items-center column-gap-10'.classNames()}>
					<i className={o.icon.classNames() + 'font-size-24 color-text'.classNames()}></i>

					<span className={'font-size-15 font-weight-500 line-height-25 color-text'.classNames()}>
						{o.label}
					</span>
				</span>
			),
		};
	});

	return (
		<>
			<div className={''.classNames() + 'employeelist-wrapper'.classNames(EmployeelistCss)}>
				<div className={''.classNames() + 'data-table-wrapper'.classNames(EmployeelistCss)}>
					<div className={'margin-top-40'.classNames() + ' data-table-filter'.classNames(EmployeelistCss)}>
						<div className={'searchbox'.classNames(EmployeelistCss)}>
							<TextField
								placeholder={__('ex. John doe')}
								value={state.filters.search || ''}
								onChange={(v) => setFilter('search', v)}
								image={SearchImg}
								icon_position={'right'}
							/>
						</div>
						{/* <div className={'filter-dropdown'.classNames(EmployeelistCss)}>
							<DropDown
								theme="filter"
								themeFilterText="Showing:"
								themeFilterIconText="Active"
								themeFilterCount="85"
								themeFilterGap="5"
								value={''}
								placeholder="Sorting"
								onChange={(v) => {
									setSorting(v);
								}}
								options={}
							/>
						</div>
						<div className={'list-style'.classNames(EmployeelistCss)}>
							<DropDown
								theme="filter"
								themeFilterText="Style"
								themeFilterIcon="ch-icon-row-vertical"
								themeFilterIconText="List"
								themeFilterCount="85"
								value={''}
								placeholder="Sorting"
								onChange={(v) => {
									setSorting(v);
								}}
								options={[]}
							/>
						</div> */}
						<div
							onClick={() => setIsActivePopup(!isActivePopup)}
							className={
								'settings'.classNames(EmployeelistCss) + 'flex-center cursor-pointer'.classNames()
							}
						>
							<i
								className={'ch-icon ch-icon-settings-gear d-inline-block vertical-align-middle font-size-18 color-text'.classNames()}
							/>
						</div>
					</div>
					<div className={'margin-top-20'.classNames() + 'data-table'.classNames(EmployeelistCss)}>
						<div className={''.classNames() + 'main-table'.classNames(EmployeelistCss)}>
							<table>
								<thead>
									<tr>
										<th>
											<div className={'first-column'.classNames(EmployeelistCss)}>
												<input
													type="checkbox"
													checked={false}
													onChange={() => 0}
												/>
												<span>ID</span>
												<span>Name</span>
											</div>
										</th>
										<th>Role</th>
										<th>Department</th>
										<th>Type</th>
										<th>Location</th>
										<th>Hire Date</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{[...tableRow].map((row, index) => (
										<tr key={index + row}>
											<th>
												<div className={'table-shadow'.classNames(EmployeelistCss)}></div>
												<div
													className={'table-stikcy-glasseffect'.classNames(EmployeelistCss)}
												></div>
												<div className={'first-column'.classNames(EmployeelistCss)}>
													<input
														type="checkbox"
														checked={false}
														onChange={() => 0}
													/>
													<div className={'color-text-light'.classNames()}>001</div>
													<div
														className={'d-flex align-items-center column-gap-10'.classNames()}
													>
														<img src={Human} alt="" />
														<span>Jane Cooper</span>
														<span
															className={
																'color-text-light margin-left-5'.classNames() +
																'table-badge'.classNames(EmployeelistCss)
															}
														>
															Invited
														</span>
													</div>
												</div>
											</th>
											<td>Marketing Executive</td>
											<td>Marketing</td>
											<td>Full Time</td>
											<td>USA</td>
											<td>22 Oct, 20</td>
											<td>
												<Options options={actions}>
													<i
														className={'ch-icon ch-icon-more color-text-light font-size-20 cursor-pointer d-inline-block margin-left-15'.classNames()}
													></i>
												</Options>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div
						className={
							'd-flex align-items-center justify-content-center margin-top-40'.classNames() +
							'data-table-pagination'.classNames(EmployeelistCss)
						}
					>
						<Pagination
							theme="data-table-pagination"
							previousLabel="Previous"
							nextLabel="Next"
							onChange={() => 0}
							pageNumber={1}
							pageCount={10}
						/>
					</div>
				</div>
			</div>

			<div
				className={
					'padding-15'.classNames() +
					`settings-modal-wrapper ${isActivePopup ? 'active' : ''}`.classNames(EmployeelistCss)
				}
			>
				<div onClick={() => setIsActivePopup(!isActivePopup)} className={'cursor-pointer'.classNames()}></div>
				<div
					className={
						'padding-40 d-flex flex-direction-column justify-content-space-between row-gap-20'.classNames() +
						`settings-modal ${isActivePopup ? 'active' : ''}`.classNames(EmployeelistCss)
					}
				>
					<div className={'d-flex flex-direction-column row-gap-20'.classNames()}>
						<div
							className={
								'd-flex align-items-center justify-content-space-between'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<span className={'font-size-20 font-weight-500 line-height-32 color-text '.classNames()}>
								{__('Edit Columns')}
							</span>
							<i
								onClick={() => setIsActivePopup(!isActivePopup)}
								className={'ch-icon ch-icon-times cursor-pointer font-size-24 color-text '.classNames()}
								style={{ color: 'rgb(0 0 0 / 40%)', fontSize: '28px', fontWeight: '600' }}
							></i>
						</div>

						<div
							className={
								'crew-hrm-border d-flex align-items-center justify-content-space-between padding-15'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i className={'ch-icon ch-icon-drag font-size-24 color-text'.classNames()}></i>
								<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
									{' '}
									ID
								</span>
							</div>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i
									className={'ch-icon ch-icon-circle-info font-size-24 color-text-light'.classNames()}
								></i>
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
							</div>
						</div>
						<div
							className={
								'crew-hrm-border d-flex align-items-center justify-content-space-between padding-15'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i className={'ch-icon ch-icon-drag font-size-24 color-text'.classNames()}></i>
								<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
									{' '}
									ID
								</span>
							</div>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i
									className={'ch-icon ch-icon-circle-info font-size-24 color-text-light'.classNames()}
								></i>
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
							</div>
						</div>
						<div
							className={
								'crew-hrm-border d-flex align-items-center justify-content-space-between padding-15'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i className={'ch-icon ch-icon-drag font-size-24 color-text'.classNames()}></i>
								<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
									{' '}
									ID
								</span>
							</div>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i
									className={'ch-icon ch-icon-circle-info font-size-24 color-text-light'.classNames()}
								></i>
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
							</div>
						</div>
						<div
							className={
								'crew-hrm-border d-flex align-items-center justify-content-space-between padding-15'.classNames() +
								''.classNames(EmployeelistCss)
							}
						>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i className={'ch-icon ch-icon-drag font-size-24 color-text'.classNames()}></i>
								<span className={'font-size-17 font-weight-500 line-height-25 color-text'.classNames()}>
									{' '}
									ID
								</span>
							</div>
							<div className={'d-flex column-gap-10'.classNames()}>
								<i
									className={'ch-icon ch-icon-circle-info font-size-24 color-text-light'.classNames()}
								></i>
								<ToggleSwitch checked={toggle} onChange={() => setToggle(!toggle)} />
							</div>
						</div>
					</div>
					<div className={'d-flex column-gap-20'.classNames() + ''.classNames(EmployeelistCss)}>
						<button
							className={'flex-1 button button-primary button-large button-outlined button-outlined-light'.classNames()}
							style={{ maxWidth: '138px' }}
						>
							{__('Cancel')}
						</button>
						<button className={'flex-1 button button-primary button-large '.classNames()}>
							{__('Update')}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
