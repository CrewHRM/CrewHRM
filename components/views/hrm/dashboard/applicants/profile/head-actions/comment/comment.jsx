import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { __, isEmpty } from '../../../../../../../utilities/helpers.jsx';
import { request } from '../../../../../../../utilities/request.jsx';
import { ContextToast } from '../../../../../../../materials/toast/toast.jsx';
import { ContextApplicationSession } from '../../../applicants.jsx';

export function Comment(props) {
    const { onClose } = props;
	const { application_id } = useParams();
	const { ajaxToast } = useContext( ContextToast );
	const { sessionRefresh } = useContext( ContextApplicationSession );

	const [state, setState] = useState({
		values: {
			comment_content: ''
		}
	});

	const setVal=(name, value)=>{
		setState({
			...state,
			values: {
				...state.values,
				[name]: value
			}
		});
	}

	const submitComment=()=>{
		const {values={}} = state;
		const {comment_content} = values;

		request( 'comment_on_application', {comment_content, application_id}, resp=>{
			ajaxToast( resp );

			if ( resp.success ) {
				onClose();
				sessionRefresh();
			}
		} );
	}

    return (
        <div data-crewhrm-selector="comment">
            <textarea
                className={'margin-top-15 margin-bottom-15 border-radius-5 border-1-5 b-color-tertiary padding-15 font-size-15 font-weight-500 d-block'.classNames()}
                placeholder={__('Write your comments')}
                style={{ width: '100%', height: '69%', resize: 'vertical' }}
				onChange={e=>setVal('comment_content', e.currentTarget.value)}
            ></textarea>

            <div className={'d-flex align-items-center'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <i
                        className={'ch-icon ch-icon-paperclip-2 font-size-20 color-text vertical-align-middle'.classNames()}
                    ></i>{' '}
                    <span className={'font-size-15 font-weight-400 color-text'.classNames()}>
                        {__('Attach a file')}
                    </span>
                </div>
                <div>
                    <button className={'button button-primary'.classNames()} disabled={isEmpty(state.values.comment_content)} onClick={submitComment}>
                        {__('Submit Comment')}
                    </button>
                </div>
            </div>
        </div>
    );
}
