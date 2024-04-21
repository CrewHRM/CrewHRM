import React, { useContext, useState } from 'react';

import style from './application.module.scss';
import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { Options } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { FieldEditorModal } from './field-editor/field-editor-modal.jsx';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { SortableList } from 'crewhrm-materials/sortable-list.jsx';
import { ContextJobEditor } from '../index.jsx';
import { sections_fields } from './form-structure.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { ErrorBoundary } from 'crewhrm-materials/error-boundary.jsx';

const getQuestionId = () => {
    return '_question_' + getRandomString();
};

export function ApplicationForm() {
    const {
        navigateTab,
        values = {},
        onChange,
        is_next_disabled,
        onSaveClick,
        saving_mode
    } = useContext(ContextJobEditor);

    const [state, setState] = useState({
        pointer: null
    });

    const onOptionClick = (action, section_name, field_id) => {
        let { pointer } = state;
        const { application_form: fields } = values;
        const field_index = fields[section_name].fields.findIndex((f) => f.id == field_id);
        const field = fields[section_name].fields[field_index];

        switch (action) {
            case 'delete':
                fields[section_name].fields.splice(field_index, 1);
                break;

            case 'duplicate':
                fields[section_name].fields.splice(field_index, 0, {
                    ...field,
                    id: getQuestionId()
                });
                break;

            case 'edit':
                pointer = {
                    section_name,
                    field_index
                };
        }

        onChange('application_form', fields);

        setState({
            ...state,
            pointer
        });
    };

    const updateField = (updated_field) => {
        // Just close the modal (without storing anything in state) if no field provided
        if (updated_field === null) {
            setState({
                ...state,
                pointer: null
            });
            return;
        }

        // Get pointer
        const { application_form: fields = {} } = values;
        const { pointer = {} } = state;
        const { section_name, field_index } = pointer;

        // Update data in the array
        if (isNaN(field_index)) {
            // This block means it's new, so assign an ID and then push to question set
            fields[section_name].fields.push({
                ...updated_field,
                enabled: true,
                id: getQuestionId()
            });
        } else {
            // It's update request
            fields[section_name].fields[field_index] = updated_field;
        }

        onChange('application_form', fields);

        // Update state
        setState({
            ...state,
            pointer: null
        });
    };

    const onToggle = (key, value, section_name, field_id) => {
        // Find field
        const { application_form: fields } = values;
        const index = fields[section_name].fields.findIndex((f) => f.id === field_id);

        // Update field
        fields[section_name].fields[index][key] = value;

        // Enable too if the field marked as required
        if (key === 'required' && value === true) {
            fields[section_name].fields[index].enabled = true;
        }

        // Remove required state if its not enabled
        if (key === 'enabled' && value === false) {
            fields[section_name].fields[index].required = false;
        }

        onChange('application_form', fields);
    };

    const updateFields = (section_name, list) => {
        const { application_form: fields = {} } = values;
        fields[section_name].fields = list;

        onChange('application_form', fields);
    };

    return (
        <>
            <Conditional show={state.pointer}>
				<ErrorBoundary>
					<FieldEditorModal
						field={
							values.application_form[state.pointer?.section_name]?.fields?.[
								state.pointer?.field_index
							] || {}
						}
						updateField={updateField}
					/>
				</ErrorBoundary>
            </Conditional>

            <div
                data-cylector="application-builder"
                className={'application'.classNames(style)}
            >
                <span
                    className={'d-block font-size-20 font-weight-600 color-text margin-bottom-40'.classNames()}
                >
                    {__('Customize your application form')}
                </span>

                {/* General fields with toggle switch */}
                {Object.keys(values.application_form).map((section_name) => {
					
                    const {
                        label,
                        fields: _input_fields,
                        addLabel,
                        sortable
                    } = values.application_form[section_name];

                    // Prepare popup options to delete, edit etc.
                    const { options = {} } = sections_fields[section_name];
                    const options_array = Object.keys(options).map((option_name) => {
                        return {
                            id: option_name,
                            label: options[option_name].label,
                            icon:
                                options[option_name].icon.classNames() +
                                'font-size-24 color-text'.classNames()
                        };
                    });

					// Can sort
					const can_sort = sortable && _input_fields.length>1;

                    return (
                        <div
                            data-cylector="section"
                            key={section_name}
                            className={'section-container'.classNames(style)}
                        >
                            <strong
                                className={'d-block font-size-17 font-weight-600 color-text margin-bottom-10'.classNames()}
                            >
                                {label}
                            </strong>

                            {(_input_fields.length && (
                                <div className={'list-container'.classNames(style)}>
                                    <SortableList
                                        disabled={!can_sort}
                                        onReorder={(list) => updateFields(section_name, list)}
                                        items={_input_fields.map((field, index) => {
                                            const {
                                                label: field_label,
                                                enabled = false,
                                                required = false,
                                                readonly = false,
                                                id: field_id
                                            } = field;
                                            const checkbox_id = 'crewhrm-checkbox-' + field_id;
                                            const is_last = index == _input_fields.length - 1;

                                            return {
                                                ...field,
                                                id: field_id, // Just to make sure it requires id
                                                rendered: (
                                                    <div
                                                        data-cylector="fields"
                                                        key={field_id}
                                                        className={
                                                            'single-row'.classNames(style) +
                                                            `d-flex align-items-center padding-vertical-10 padding-horizontal-15 ${
                                                                !is_last
                                                                    ? 'border-bottom-1-5 b-color-tertiary'
                                                                    : ''
                                                            }`.classNames()
                                                        }
                                                    >
														<Conditional show={can_sort}>
															<div
                                                                className={
                                                                    'd-flex align-items-center position-absolute'.classNames() +
                                                                    'drag-icon'.classNames(style)
                                                                }
                                                            >
                                                                <i
                                                                    className={'ch-icon ch-icon-drag font-size-26 color-text-light position-absolute'.classNames()}
                                                                    style={{ left: '-50px' }}
                                                                ></i>
                                                            </div>
														</Conditional>
														
                                                        <div>
                                                            <input
                                                                id={checkbox_id}
                                                                type="checkbox"
                                                                checked={
                                                                    enabled || readonly || false
                                                                }
                                                                disabled={readonly}
                                                                onChange={(e) =>
                                                                    onToggle(
                                                                        'enabled',
                                                                        e.currentTarget.checked
                                                                            ? true
                                                                            : false,
                                                                        section_name,
                                                                        field_id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className={'flex-1'.classNames()}>
                                                            <label
                                                                className={'d-block font-size-15 font-weight-500 line-height-25 color-text margin-left-10'.classNames()}
                                                                htmlFor={checkbox_id}
                                                            >
                                                                {field_label}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            {(readonly && (
                                                                <span
                                                                    className={
                                                                        'required'.classNames(
                                                                            style
                                                                        ) +
                                                                        'font-size-13 font-weight-500 padding-vertical-8 padding-horizontal-15 border-radius-50'.classNames()
                                                                    }
                                                                >
                                                                    {__('Required')}
                                                                </span>
                                                            )) || (
                                                                <div
                                                                    className={'d-inline-flex align-items-center column-gap-10'.classNames()}
                                                                >
                                                                    <span
                                                                        className={'d-inline-block font-size-15 font-weight-400 color-text-light'.classNames()}
                                                                    >
                                                                        {__('Required')}
                                                                    </span>

                                                                    <ToggleSwitch
                                                                        checked={required}
                                                                        onChange={(required) =>
                                                                            onToggle(
                                                                                'required',
                                                                                required,
                                                                                section_name,
                                                                                field_id
                                                                            )
                                                                        }
                                                                    />

                                                                    {(options_array.length && (
                                                                        <Options
                                                                            options={options_array}
                                                                            onClick={(action) =>
                                                                                onOptionClick(
                                                                                    action,
                                                                                    section_name,
                                                                                    field_id
                                                                                )
                                                                            }
                                                                        >
                                                                            <i
                                                                                className={'ch-icon ch-icon-more font-size-20 color-text-light'.classNames()}
                                                                            ></i>
                                                                        </Options>
                                                                    )) ||
                                                                        null}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            };
                                        })}
                                    />
                                </div>
                            )) ||
                                null}

                            {addLabel && (
                                <div
                                    className={`d-flex align-items-center column-gap-10 padding-vertical-10 padding-horizontal-15 border-1 border-radius-10 b-color-secondary cursor-pointer ${
                                        _input_fields.length ? 'margin-top-10' : ''
                                    }`.classNames()}
                                    onClick={() =>
                                        setState({ ...state, pointer: { section_name } })
                                    }
                                >
                                    <i
                                        className={'ch-icon ch-icon-add-circle font-size-24 color-secondary'.classNames()}
                                    ></i>
                                    <span
                                        className={'font-size-15 font-weight-500 color-secondary'.classNames()}
                                    >
                                        {addLabel}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}

                <FormActionButtons
                    onBack={() => navigateTab(-1)}
                    onNext={onSaveClick}
                    disabledNext={is_next_disabled || saving_mode}
                    nextText={values.job_status != 'publish' ?__('Publish Now') : __('Update Now')}
                />
            </div>
        </>
    );
}
