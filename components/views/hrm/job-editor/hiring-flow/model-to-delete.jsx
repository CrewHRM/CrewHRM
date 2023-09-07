import React, { useContext, useState } from 'react';
import { Modal } from '../../../../materials/modal.jsx';
import { __, sprintf } from '../../../../utilities/helpers.jsx';
import { CoverImage } from '../../../../materials/image/image.jsx';
import { DropDown } from '../../../../materials/dropdown/dropdown.jsx';
import { Warning } from '../../../../materials/warning/warning.jsx';
import { request } from '../../../../utilities/request.jsx';
import { ContextNonce } from '../../../../materials/mountpoint.jsx';
import { ContextToast } from '../../../../materials/toast/toast.jsx';

import avatar from '../../../../images/avatar.svg';

function MoveContent({ stage_name, overview:{count, peak=[]}, onCancel, onConfirm, moveTo = [] }) {
    const more = count - peak.length;
    const [state, setState] = useState({
        move_to: null
    });

    return (
        <div className={'padding-vertical-40 padding-horizontal-50 position-relative'.classNames()} style={{width: '619px', maxWidth: '100%'}}>
            <i
                className={'ch-icon ch-icon-times font-size-24 color-text-light position-absolute right-0 top-0 cursor-pointer'.classNames()}
                onClick={()=>onCancel()}
            ></i>

            <div className={'d-flex align-items-center justify-content-center'.classNames()}>
                {peak.map(({ application_id, avatar_url }, index) => {
                    return (
                        <div
                            key={application_id}
                            className={'d-inline-block'.classNames()}
                            style={index>0 ? { marginLeft: '-12px' } : {}}
                        >
                            <CoverImage 
								src={avatar_url || avatar} 
								circle={true} 
								width={42} />
                        </div>
                    );
                })}

                {more ? <div className={'d-inline-block'.classNames()} style={{ marginLeft: '-12px' }}>
					<CoverImage circle={true} width={42} backgroundColor="#236BFE">
						<span
							className={'font-size-15 font-weight-700 line-height-32 letter-spacing--3 color-white'.classNames()}
						>
							{more}+
						</span>
					</CoverImage>
				</div> : null}
            </div>

            <div className={'margin-top-20 margin-bottom-20 text-align-center'.classNames()}>
                <span
                    className={'d-block font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-bottom-5'.classNames()}
                >
                    {count > 1
                        ? sprintf(
                              __('About %s candidates are in the %s stage.'),
                              count,
                              stage_name
                          )
                        : sprintf(__('1 candidate is in the %s stage.'), stage_name)}
                </span>

                <span
                    className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text'.classNames()}
                >
                    {__('To remove this stage, candidates must be moved to another stage.')}
                </span>
            </div>

			{moveTo.length ? <div className={'margin-auto'.classNames()} style={{ maxWidth: '356px' }}>
                <span
                    className={'d-block font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-bottom-10'.classNames()}
                >
                    {__('Move to')}
                </span>

                <div className={'d-flex align-items-center column-gap-10'.classNames()}>
                    <div className={'flex-1'.classNames()}>
                        <DropDown
                            className={'w-full padding-vertical-5 padding-horizontal-12 border-1 b-color-text height-40'.classNames()}
                            value={state.move_to}
                            options={moveTo}
                            onChange={(move_to) => setState({ move_to })}
                            placeholder={__('Select Stage')}
                        />
                    </div>
                    <div>
                        <button
                            className={'button button-primary'.classNames()}
                            onClick={()=>onConfirm(state.move_to)}
                            disabled={!state.move_to}
                        >
                            {__('Move')}
                        </button>
                    </div>
                </div>
            </div> : 
			<div className={'text-align-center color-warning'.classNames()}>
				{__('No other stage found to move to')}
			</div>}
        </div>
    );
}

export function DeletionConfirm(props) {
	const { job_id, stage_id, stage_name, onDelete } = props;
	const {nonce, nonceAction} = useContext(ContextNonce);
	const {ajaxToast} = useContext(ContextToast);

    const [state, setState] = useState({
		overview: null,
		loading: false
    });
	
	const deleteStage=(move_to)=>{
		setState({
			...state,
			loading: true
		});

		request( 'delete_hiring_stage', {job_id, stage_id, move_to, nonce, nonceAction}, resp=>{
			const { success, data } = resp;
			const { overview={} } = data || {};

			if ( success ) {
				// Deleted from server. Now from browser
				onDelete();
				
			} else if ( overview ) {
				// Could not delete as target stage not specified and there are applicants in the stage
				setState({
					...state,
					loading: false,
					overview
				});

			} else {
				ajaxToast(resp);
				props.closeModal();
			}
		} );
	}

    return (
        <>
            {/* Confirm Modal */}
            {!state.overview ? <Modal>
				<Warning
					loading={state.loading}
					onCancel={props.closeModal}
					onConfirm={deleteStage}
				/>
			</Modal> : null}

            {/* Move Modal */}
            {state.overview ? <Modal>
				<MoveContent 
					stage_name={stage_name}
					moveTo={props.moveTo}
					onCancel={props.closeModal}
					onConfirm={deleteStage}
					overview={state.overview}/>
			</Modal> : null}
        </>
    );
}
