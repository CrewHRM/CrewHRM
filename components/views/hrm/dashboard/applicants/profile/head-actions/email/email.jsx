import React, { useContext, useState } from 'react';
import { __, isEmpty, storage } from '../../../../../../../utilities/helpers.jsx';
import { TextEditor } from '../../../../../../../materials/text-editor/text-editor.jsx';

import style from './email.module.scss';
import { LoadingIcon } from '../../../../../../../materials/loading-icon/loading-icon.jsx';
import { request } from '../../../../../../../utilities/request.jsx';
import { ContextToast } from '../../../../../../../materials/toast/toast.jsx';
import { FileUpload } from '../../../../../../../materials/file-ipload/file-upload.jsx';

const fields = {
	from_address: {
		label: __('From')
	},
	to: {
		label: __('To'),
		disabled: true
	},
	subject: {
		label: __('Subject')
	},
	body: {
		label: __('Message'),
		placeholder: __('Write your message')
	}
};

export function Email({onClose, application}) {
	const {ajaxToast} = useContext(ContextToast);
	
	const store  = storage( 'application_email_values', true );
	const values = store.getItem({
		from_address: application.recruiter_email,
		to: application.email,
		subject: '',
		body: ''
	});

    const [state, setState] = useState({
		sending: false,
        values
    });

    const setVal = (name, value) => {
		const values = {
			...state.values,
			[name]: value
		}

		store.setItem(values);

		setState({
            ...state,
            values
        });
    };

	const sendMail=()=>{
		// Show loader
		setState({
			...state,
			sending: true
		});

		const {values: mail} = state;
		request('mail_to_applicant', {mail}, resp=>{
			ajaxToast(resp);

			if ( resp.success ) {
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
		});
	}

	const button_disabled = Object.keys(state.values).filter(name=>isEmpty( state.values[name] )).length>0;

    return (
        <div data-crewhrm-selector="email">
            {Object.keys(fields).map((field) => {
                let { label, placeholder, disabled } = fields[field];
                return (
                    <div
                        key={field}
                        className={
                            'd-flex margin-bottom-15'.classNames() +
                            'email-fields'.classNames(style)
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
                            {
								field == 'body' ? <TextEditor
									value={state.values[field]}
									disabled={state.sending}
                                    className={'font-size-15 font-weight-500 line-height-24 color-text'.classNames()}
                                    onChange={v=>setVal(field, v)}/>
								:
                                <input
                                    name={field}
                                    type="text"
                                    placeholder={placeholder}
                                    value={state.values[field]}
									disabled={state.sending || disabled}
                                    onChange={e=>setVal(field, e.currentTarget.value)}
                                    className={'font-size-15 font-weight-500 line-height-24 color-text'.classNames()}
                                />
                            }
                        </div>
                    </div>
                );
            })}

            <div className={'d-flex align-items-center'.classNames()}>
				<FileUpload 
					value={state.values['attachment']}
					onChange={file=>setVal('attachment', file)}
					layoutComp={({onCLick})=>{
						return <div className={'flex-1 cursor-pointer'.classNames()} onClick={onCLick}>
							<i
								className={'ch-icon ch-icon-paperclip-2 font-size-20 color-text vertical-align-middle d-inline-block margin-right-5'.classNames()}
							></i>
							<span className={'font-size-15 font-weight-400 color-text'.classNames()}>
								{ state.values?.attachment?.name || __('Attach a file')}
							</span>
						</div>
					}
				}/>
                
                <div>
                    <button className={'button button-primary'.classNames()} disabled={button_disabled || state.sending} onClick={sendMail}>
                        {__('Send Email')} {state.sending ? <LoadingIcon/> : null }
                    </button>
                </div>
            </div>
        </div>
    );
}
