import React from 'react';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { FileUpload } from 'crewhrm-materials/file-upload/file-upload.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { DateField } from 'crewhrm-materials/date-time.jsx';
import { ExpandableContent } from 'crewhrm-materials/expandable-content/expandable-content.jsx';
import { TextEditor } from 'crewhrm-materials/text-editor/text-editor.jsx';
import { TextField } from 'crewhrm-materials/text-field/text-field.jsx';
import { AddressFields } from 'crewhrm-materials/address-fields.jsx';
import { RadioCheckbox } from 'crewhrm-materials/radio-checkbox.jsx';
import { PhoneField } from 'crewhrm-materials/phone-field/phone-field.jsx';

export function RenderField({ field = {}, onChange = () => { }, values = {}, showErrorsAlways }) {

	if (Array.isArray(field)) {
		return <div className={'d-flex align-items-center column-gap-20'.classNames()}>
			{field.map(f => {
				return <div key={f.name} className={'flex-1'.classNames()}>
					<RenderField {...{ field: f, onChange, values, showErrorsAlways }} />
				</div>
			})}
		</div>
	}

	const {
		name,
		label,
		type,
		placeholder,
		maxlength,
		maxsize,
		options,
		disclaimer,
		required,
		accept,
		enabled,
		regex
	} = field;

	return enabled ?
		<div data-cylector="single-field">
			{disclaimer ?
				<ExpandableContent className={'margin-bottom-30'.classNames()}>
					<span
						className={'d-block font-size-20 font-weight-600 color-text'.classNames()}
					>
						{disclaimer?.heading}
					</span>
					<div
						className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 color-text'.classNames()}
					>
						{disclaimer?.description}
					</div>
				</ExpandableContent> : null
			}

			<span className={'d-block font-size-15 font-weight-500 margin-bottom-10 color-text'.classNames()}>
				{label}
				{label && required ?
					<span className={'color-error'.classNames()}>*</span> : null
				}
			</span>

			{['text', 'url', 'email', 'textarea'].indexOf(type) > -1 ?
				<TextField
					value={values[name] || ''}
					type={type === 'textarea' ? 'textarea' : type}
					placeholder={placeholder}
					onChange={v => onChange(name, v)}
					regex={regex}
					showErrorsAlways={showErrorsAlways}
					required={required}
				/> : null
			}

			{type == 'textarea_rich' ?
				<TextEditor
					onChange={(v) => onChange(name, v)}
					value={values[name] || ''}
					placeholder={placeholder}
					required={required}
					showErrorsAlways={showErrorsAlways}
				/> : null
			}

			{type == 'dropdown' ?
				<DropDown
					value={values[name]}
					options={(typeof options === 'object') ? options.map(item => ({ ...item, label: __(item.label) })) : options}
					placeholder={placeholder}
					onChange={(value) => onChange(name, value)}
					required={required}
					showErrorsAlways={showErrorsAlways}
				/> : null
			}

			{type == 'date' ?
				<DateField
					value={values[name]}
					onChange={(value) => onChange(name, value)}
					required={required}
					showErrorsAlways={showErrorsAlways}
				/> : null
			}

			{type == 'checkbox' || type == 'radio' ?
				<RadioCheckbox
					type={type}
					name={name}
					value={values[name]}
					options={options || []}
					onChange={value => onChange(name, value)}
					required={required}
					showErrorsAlways={showErrorsAlways} /> : null
			}

			{type == 'file' ?
				<FileUpload
					value={values[name]}
					textPrimary={placeholder}
					minlength={required ? 1 : 0}
					maxlength={maxlength}
					maxsize={maxsize}
					accept={accept}
					onChange={(files) => onChange(name, files)}
					showErrorsAlways={showErrorsAlways}
				/> : null
			}

			{type === 'address' ?
				<AddressFields
					values={values}
					onChange={onChange}
					showErrorsAlways={showErrorsAlways}
					required={required} /> : null
			}

			{type === 'phone' ?
				<PhoneField
					defaultCountry="ua"
					value={values[name] || ''}
					onChange={v => onChange(name, v)}
					required={required}
				/> : null
			}
		</div> : null
}
