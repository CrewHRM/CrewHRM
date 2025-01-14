/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'crewhrm-materials/modal.jsx';
import { __, getRandomString } from 'crewhrm-materials/helpers.jsx';
import { DropDown } from 'crewhrm-materials/dropdown/dropdown.jsx';
import { ToggleSwitch } from 'crewhrm-materials/toggle-switch/ToggleSwitch.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import StarToggle from './star-toggle';
import { request } from 'crewhrm-materials/request.jsx';

const question_types = {
    textarea: __('Paragraph'),
    date: __('Date'),
    text: __('Short Answer'),
    // file: __('File Upload'),
    checkbox: __('Multiple Choice'),
    radio: __('Single Choice'),
    dropdown: __('Dropdown')
};

const option_able = ['checkbox', 'radio', 'dropdown'];

export function FieldEditorModal(props) {
    const [state, setState] = useState({
        last_id: null,
        exclude_focus: (props.field?.field_options || []).map((f) => f.id),
        field: props.field || {},
        ko_templates: []
    });

    const { type: field_type, field_options = [], id: field_id } = state.field;

    const addOption = () => {
        const id = getRandomString();

        onChange(
            'field_options',
            [
                ...field_options,
                {
                    id,
                    label: __('Untitled')
                }
            ],
            {
                last_id: id
            }
        );
    };

    const deleteOption = (id) => {
        // Find index
        const { field_options = [] } = state.field;
        const index = field_options.findIndex((f) => f.id === id);

        // Remove desired one
        field_options.splice(index, 1);

        // Update state
        onChange('field_options', field_options);
    };

    const updateOptionLabel = (id, value) => {
        const index = field_options.findIndex((f) => f.id === id);
        field_options[index].label = value;
        onChange('field_options', field_options);
    };

    const onChange = (name, value, ob = {}) => {
        setState({
            ...state,
            ...ob,
            field: {
                ...state.field,
                [name]: value
            }
        });
    };

    const fetchEmailTemplates = async () => {
        return new Promise((resolve, reject) => {
            request('getAutoRejectEmailTemplates', {}, (resp) => {
                if (resp) {
                    resolve(resp);
                } else {
                    reject(new Error('Failed to fetch email templates'));
                }
            });
        });
    }

    useEffect(() => {
        const { last_id, exclude_focus } = state;
        if (!last_id || exclude_focus.indexOf(last_id) > -1) {
            return;
        }

        const input = document.getElementById('crewhrm-field-option-' + last_id);

        if (input) {
            input.focus();
            input.select();

            setState({
                ...state,
                exclude_focus: [...exclude_focus, last_id]
            });
        }
    }, [state.field.field_options]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const resp = await fetchEmailTemplates();
                if (resp?.success) {
                    const templates = resp.data?.templates || [];
                    setState((prevState) => ({
                        ...prevState,
                        ko_templates: templates,
                    }));
                } else {
                    console.error('Invalid response from fetchEmailTemplates:', resp);
                }
            } catch (error) {
                console.error('Error fetching email templates:', error);
            }
        };
        if (props.pointer && props.pointer == 'ko_questions') {
            onChange('type', 'radio');

            const timer = setTimeout(fetchTemplates, 200);
            return () => clearTimeout(timer);
        }
    }, [props.pointer]);

    const handleStarToggle = (id, isFilled) => {
        setState((prevState) => {
            const currentExpected = prevState.field?.expected || [];

            let updatedExpected;
            if (isFilled) {
                // Add ID if filled and not already present
                updatedExpected = currentExpected.includes(id)
                    ? currentExpected
                    : [...currentExpected, id];
            } else {
                // Remove ID if not filled
                updatedExpected = currentExpected.filter((existingId) => existingId !== id);
            }

            return {
                ...prevState,
                field: {
                    ...prevState.field,
                    expected: updatedExpected,
                },
            };
        });
    };

    const need_options = option_able.indexOf(field_type) > -1;
    const btn_disabled =
        !state.field.type || !state.field.label || (need_options && !field_options.length);

    return (
        <Modal nested={true}>
            <div
                data-cylector="question-head"
                className={'d-flex align-items-center margin-bottom-30'.classNames()}
            >
                <div className={'flex-1'.classNames()}>
                    <span className={'font-size-24 font-weight-600 color-text'.classNames()}>
                        {__('Add a question')}
                    </span>
                </div>
                <div>
                    {/* <i className={'ch-icon ch-icon-more font-size-24 color-text-light cursor-pointer'.classNames()}></i> */}
                </div>
            </div>

            <div
                data-cylector="question-type"
                className={'d-flex align-items-center margin-bottom-15'.classNames()}
            >
                <div className={'flex-4'.classNames()}>
                    {props.pointer && props.pointer !== 'ko_questions' ? (
                        <DropDown
                            className={'padding-vertical-14 padding-horizontal-15 border-radius-10 border-1 b-color-text font-size-15 font-weight-600 color-text'.classNames()}
                            nested={true}
                            placeholder={__('Select Question Type')}
                            value={field_type}
                            onChange={(value) => onChange('type', value)}
                            clearable={false}
                            options={Object.keys(question_types).map((t) => {
                                return { id: t, label: question_types[t] };
                            })}
                            variant='primary'
                            size="md"
                        />
                    ) :
                        <DropDown
                            className={'padding-vertical-14 padding-horizontal-15 border-radius-10 border-1 b-color-text font-size-15 font-weight-600 color-text'.classNames()}
                            nested={true}
                            placeholder={__('Select Email Template')}
                            value={state.field.email_template}
                            onChange={(value) => onChange('email_template', value)}
                            clearable={false}
                            options={state.ko_templates}
                            variant='primary'
                            size="md"
                        />
                    }
                </div>
                <div
                    className={'flex-5 d-flex align-items-center justify-content-end column-gap-8'.classNames()}
                >
                    <span className={'font-size-15 font-weight-400 color-text-light'.classNames()}>
                        {__('Required')}
                    </span>
                    <ToggleSwitch
                        checked={state.field.required || false}
                        onChange={(required) => onChange('required', required)}
                    />
                </div>
            </div>

            <Line className={'margin-bottom-15'.classNames()} />

            <div className={'margin-bottom-15'.classNames()}>
                <span
                    className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}
                >
                    {__('Question')}
                </span>
                <input
                    value={state.field.label || ''}
                    className={'d-block padding-15 border-1-5 b-color-tertiary b-color-active-primary border-radius-10 font-size-15 font-weight-400 line-height-25 color-text width-p-100 height-48'.classNames()}
                    placeholder={__('ex. How did you hear about this job?')}
                    onChange={(e) => onChange('label', e.currentTarget.value)}
                />
            </div>

            {(need_options && (
                <div
                    data-cylector="question-options"
                    className={'margin-bottom-15'.classNames()}
                >
                    <span
                        className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}
                    >
                        {__('Options')}
                    </span>

                    <div className={'border-1-5 b-color-tertiary border-radius-10'.classNames()}>
                        {field_options.map((option) => {
                            let { id, label } = option;
                            return (
                                <div
                                    key={id}
                                    className={'d-flex align-items-center column-gap-20 padding-vertical-10 padding-horizontal-15 border-bottom-1-5 b-color-tertiary'.classNames()}
                                >
                                    <div className={'flex-1'.classNames()}>
                                        <input
                                            id={'crewhrm-field-option-' + id}
                                            type="text"
                                            value={label}
                                            className={'text-field-flat font-size-15 font-weight-500 line-height-25'.classNames()}
                                            onChange={(e) =>
                                                updateOptionLabel(id, e.currentTarget.value)
                                            }
                                        />
                                    </div>
                                    <div className={'d-flex align-items-center column-gap-20'.classNames()}>
                                        <StarToggle id={id} initialState={state.field?.expected?.includes(id)} onToggle={handleStarToggle} />
                                        <div>
                                            <i
                                                className={'ch-icon ch-icon-trash font-size-24 color-error cursor-pointer'.classNames()}
                                                onClick={() => deleteOption(id)}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className={'padding-vertical-10 padding-horizontal-10'.classNames()}>
                            <span
                                className={'d-inline-flex align-items-center column-gap-10 cursor-pointer'.classNames()}
                                onClick={addOption}
                            >
                                <i
                                    className={'ch-icon ch-icon-add-square font-size-18 color-secondary'.classNames()}
                                ></i>
                                <span
                                    className={'font-size-15 font-weight-500 line-height-25 color-text-light color-hover-secondary'.classNames()}
                                >
                                    {__('Add Option')}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            )) ||
                null}

            <div
                data-cylector="question-action"
                className={'d-flex align-items-center justify-content-end column-gap-21'.classNames()}
            >
                <span
                    className={'font-size-15 font-weight-500 letter-spacing--3 color-text-light cursor-pointer'.classNames()}
                    onClick={() => props.updateField(null)}
                >
                    {__('Cancel')}
                </span>
                <button
                    className={'button button-primary'.classNames()}
                    disabled={btn_disabled}
                    onClick={() => props.updateField(state.field)}
                >
                    {field_id ? __('Update Question') : __('Add Question')}
                </button>
            </div>
        </Modal>
    );
}
