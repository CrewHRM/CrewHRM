import React, { useContext, useState } from 'react';
import { __, getFileId, isEmpty, storage } from '../../../../../../../utilities/helpers.jsx';
import { TextEditor } from '../../../../../../../materials/text-editor/text-editor.jsx';

import { LoadingIcon } from '../../../../../../../materials/loading-icon/loading-icon.jsx';
import { request } from '../../../../../../../utilities/request.jsx';
import { ContextToast } from '../../../../../../../materials/toast/toast.jsx';
import { FileUpload } from '../../../../../../../materials/file-ipload/file-upload.jsx';
import { Conditional } from '../../../../../../../materials/conditional.jsx';
import { ListFile } from '../../../../../../../materials/file-list.jsx';

import style from './email.module.scss';

const fields = {
    from_address: {
        label: __('From'),
        type: 'text'
    },
    to: {
        label: __('To'),
        disabled: true,
        type: 'text'
    },
    subject: {
        label: __('Subject'),
        type: 'text'
    },
    body: {
        label: __('Message'),
        placeholder: __('Write your message'),
        type: 'textarea_rich'
    }
};

export function Email({ onClose, application }) {
    const { ajaxToast } = useContext(ContextToast);

    const store = storage('application_email_values', true);
    const values = store.getItem({
        from_address: application.recruiter_email,
        to: application.email,
        subject: '',
        body: '',
        attachments: []
    });

    const [state, setState] = useState({
        sending: false,
        values
    });

    const setVal = (name, value) => {
        const values = {
            ...state.values,
            [name]: value
        };

        store.setItem({ ...values, attachments: [] });

        setState({
            ...state,
            values
        });
    };

    const sendMail = () => {
        // Show loader
        setState({
            ...state,
            sending: true
        });

        const { values: mail } = state;

        request(
            'mail_to_applicant',
            { mail: { ...mail, attachment_single: mail.attachments[0] } },
            (resp) => {
                ajaxToast(resp);

                if (resp.success) {
                    // Delete the persistent content
                    store.removeItem();

                    // Close the mailer if sent successfully
                    onClose();
                } else {
                    // Just remove the sending state if there's an error
                    setState({
                        ...state,
                        sending: false
                    });
                }
            }
        );
    };

    const removeAttachment = (index) => {
        const { attachments = [] } = state.values;
        attachments.splice(index, 1);
        setVal('attachments', attachments);
    };

    const renderField = (field_name, field = {}) => {
        let { label, placeholder, disabled, type, attachments = [] } = field;

        return (
            <div
                className={
                    'd-flex margin-bottom-15'.classNames() + 'email-fields'.classNames(style)
                }
            >
                <div
                    className={
                        'margin-right-10 font-size-15 font-weight-500'.classNames() +
                        'label'.classNames(style)
                    }
                >
                    {label}
                </div>
                <div className={'flex-1'.classNames()}>
                    <Conditional show={type == 'textarea_rich'}>
                        <TextEditor
                            value={state.values[field_name]}
                            disabled={state.sending}
                            className={'font-size-15 font-weight-500 line-height-24 color-text'.classNames()}
                            onChange={(v) => setVal(field_name, v)}
                        />
                    </Conditional>

                    <Conditional show={type == 'text'}>
                        <input
                            name={field_name}
                            type="text"
                            placeholder={placeholder}
                            value={state.values[field_name]}
                            disabled={state.sending || disabled}
                            onChange={(e) => setVal(field_name, e.currentTarget.value)}
                            className={'font-size-15 font-weight-500 line-height-24 color-text'.classNames()}
                        />
                    </Conditional>

                    <Conditional show={type == 'attachments'}>
                        <ListFile files={attachments} onRemove={removeAttachment} />
                    </Conditional>
                </div>
            </div>
        );
    };

    const button_disabled =
        Object.keys(state.values).filter((name) => isEmpty(state.values[name])).length > 0;

    return (
        <div data-crewhrm-selector="email">
            {Object.keys(fields).map((field_name) => {
                return <div key={field_name}>{renderField(field_name, fields[field_name])}</div>;
            })}

            <Conditional show={state.values.attachments.length > 0}>
                <div>
                    {renderField('attachments', {
                        type: 'attachments',
                        attachments: state.values.attachments,
                        label: __('Files')
                    })}
                </div>
            </Conditional>

            <div className={'d-flex align-items-center'.classNames()}>
                <FileUpload
                    maxlenth={500}
                    value={state.values['attachments']}
                    onChange={(file) => setVal('attachments', file)}
                    layoutComp={({ onCLick }) => {
                        return (
                            <div className={'flex-1 cursor-pointer'.classNames()} onClick={onCLick}>
                                <i
                                    className={'ch-icon ch-icon-paperclip-2 font-size-20 color-text vertical-align-middle d-inline-block margin-right-5'.classNames()}
                                ></i>
                                <span
                                    className={'font-size-15 font-weight-400 color-text'.classNames()}
                                >
                                    {__('Attach a file')}
                                </span>
                            </div>
                        );
                    }}
                />

                <div>
                    <button
                        className={'button button-primary'.classNames()}
                        disabled={button_disabled || state.sending}
                        onClick={sendMail}
                    >
                        {__('Send Email')} {state.sending ? <LoadingIcon /> : null}
                    </button>
                </div>
            </div>
        </div>
    );
}
