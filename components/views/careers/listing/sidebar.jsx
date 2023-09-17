import React from "react";
import { TagField } from '../../../materials/tag-field/tag-field.jsx';

import style from './listing.module.scss';

export function CareersSidebar({filterList}) {

	return <div data-crewhrm-selector="sidebar" className={'sidebar'.classNames(style)}>
		<div>
			{Object.keys(filterList).map((filter_key) => {
				let {
					section_label,
					selection_type,
					count = 2,
					options = []
				} = filterList[filter_key];

				return (
					<div
						key={filter_key}
						className={'margin-bottom-23 overflow-auto'.classNames()}
					>
						<span
							className={'d-block font-size-14 font-weight-700 line-height-24 letter-spacing--14 color-text-light margin-bottom-16'.classNames()}
						>
							{section_label} {count}
						</span>

						{selection_type == 'list' ? options.map((option) => {
								let { id, label, count } = option;
								let is_active = state.filters[filter_key] === id;
								return (
									<span
										key={id}
										className={`d-block font-size-14 cursor-pointer margin-bottom-18 ${
											is_active
												? 'font-weight-600 color-text'
												: 'font-weight-500 color-text-light'
										}`.classNames()}
										onClick={() => setFilter(filter_key, id)}
									>
										{label} {(count && `(${count})`) || null}
									</span>
								);
							}) : null
						}

						{selection_type == 'tag' ? <div>
								<TagField
									theme="tag"
									behavior="radio"
									options={options}
									value={state.filters[filter_key]}
									onChange={(v) => setFilter(filter_key, v)}
								/>
							</div> : null
						}
					</div>
				);
			})}
		</div>
	</div>
}