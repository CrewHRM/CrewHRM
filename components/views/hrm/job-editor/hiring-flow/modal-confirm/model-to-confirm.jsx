import React, { useState } from 'react';
import { Modal } from '../../../../../materials/modal.jsx';
import { __, sprintf } from '../../../../../utilities/helpers.jsx';

import avatar from '../../../../../images/avatar.svg';
import style from './confirm.module.scss';
import { CoverImage } from '../../../../../materials/image/image.jsx';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { sequences } from '../hiring-flow.jsx';

function Content({ stage, openMoveDiloague, closeModal }) {
    const btn_class =
        'font-size-15 font-weight-400 letter-spacing--3 padding-vertical-10 padding-horizontal-15 border-radius-5 border-1-5 b-color-tertiary cursor-pointer'.classNames();

    return (
        <div className={'confirm'.classNames(style) + 'text-align-center'.classNames()}>
            <span
                className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text margin-bottom-30'.classNames()}
            >
                {__("Are you sure, you want to delete this item. We won't be able to recover it.")}
            </span>
            <button
                className={
                    'cancel-button'.classNames(style) + btn_class + 'margin-right-20'.classNames()
                }
                onClick={closeModal}
            >
                {__('Cancel')}
            </button>
            <button
                className={'delete-button'.classNames(style) + btn_class}
                onClick={openMoveDiloague}
            >
                {__('Delete')}
            </button>
        </div>
    );
}

function MoveContent({ stage, total, users = [], closeModal, deleteFlow }) {
    const more = total - users.length;
    const [state, setState] = useState({
        move_to: null
    });

    return (
        <div className={'move'.classNames(style) + 'position-relative'.classNames()}>
            <i
                className={'ch-icon ch-icon-times font-size-24 color-text-light position-absolute right-0 top-0 cursor-pointer'.classNames()}
                onClick={closeModal}
            ></i>

            <div className={'d-flex align-items-center justify-content-center'.classNames()}>
                {users.map(({ user_id, avatar_url }, index) => {
                    return (
                        <div
                            key={user_id}
                            className={'d-inline-block'.classNames()}
                            style={index ? { marginLeft: '-12px' } : {}}
                        >
                            <CoverImage src={avatar_url} circle={true} width={42} />
                        </div>
                    );
                })}

                {(more && (
                    <div className={'d-inline-block'.classNames()} style={{ marginLeft: '-12px' }}>
                        <CoverImage circle={true} width={42} backgroundColor="#236BFE">
                            <span
                                className={'font-size-15 font-weight-700 line-height-32 letter-spacing--3 color-white'.classNames()}
                            >
                                {more}+
                            </span>
                        </CoverImage>
                    </div>
                )) ||
                    null}
            </div>

            <div className={'margin-top-20 margin-bottom-20 text-align-center'.classNames()}>
                <span
                    className={'d-block font-size-15 font-weight-400 letter-spacing--3 color-text-light margin-bottom-5'.classNames()}
                >
                    {total > 1
                        ? sprintf(
                              __('About %s candidates are in the %s stage.'),
                              total,
                              stage.label
                          )
                        : sprintf(__('1 candidate is in the %s stage.'), stage.label)}
                </span>

                <span
                    className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text'.classNames()}
                >
                    {__('To remove this stage, candidates must be moved to another stage.')}
                </span>
            </div>

            <div className={'margin-auto'.classNames()} style={{ maxWidth: '356px' }}>
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
                            options={sequences}
                            onChange={(move_to) => setState({ move_to })}
                            placeholder={__('Select Stage')}
                        />
                    </div>
                    <div>
                        <button
                            className={'button button-primary'.classNames()}
                            onClick={deleteFlow}
                            disabled={!state.move_to}
                        >
                            {__('Move')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DeletionConfirm(props) {
    const [state, setState] = useState({
        show_move_modal: false,
        total_users: 34,
        peak_users: [
            {
                user_id: 1,
                avatar_url: avatar
            },
            {
                user_id: 2,
                avatar_url: avatar
            },
            {
                user_id: 3,
                avatar_url: avatar
            }
        ]
    });

    return (
        <>
            {/* Confirm Modal */}
            {(!state.show_move_modal && (
                <Modal>
                    <Content
                        {...props}
                        openMoveDiloague={() => setState({ ...state, show_move_modal: true })}
                    />
                </Modal>
            )) ||
                null}

            {/* Move Modal */}
            {(state.show_move_modal && (
                <Modal>
                    <MoveContent {...props} total={state.total_users} users={state.peak_users} />
                </Modal>
            )) ||
                null}
        </>
    );
}
