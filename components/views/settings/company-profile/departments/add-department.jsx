import React, { useContext, useState } from 'react';
import { Modal } from 'crewhrm-materials/modal.jsx';
import { __ } from 'crewhrm-materials/helpers.jsx';
import { request } from 'crewhrm-materials/request.jsx';
import { ContextToast } from 'crewhrm-materials/toast/toast.jsx';

export function AddDepartmentModal({ closeModal, onAdd }) {
    const { ajaxToast } = useContext(ContextToast);

    const [state, setState] = useState({
        department_name: null
    });

    const addNow = () => {
        const { department_name } = state;

        request('addDepartment', { department_name }, (resp) => {
            ajaxToast(resp);

            if (resp?.success) {
                const { id, departments = [] } = resp?.data || {};
                onAdd({ id, departments });
            } else {
                closeModal();
            }
        });
    };

    return (
        <Modal>
            <span
                className={'d-block font-size-24 font-weight-600 color-text margin-bottom-20'.classNames()}
            >
                {__('Add Department')}
            </span>

            <div className={'padding-vertical-15'.classNames()}>
                <span
                    className={'d-block font-size-15 font-weight-500 color-text margin-bottom-10'.classNames()}
                >
                    {__('Department Name')}
                </span>

                <input
                    type="text"
                    className={'w-full padding-15 border-1-5 b-color-tertiary b-color-active-primary border-radius-10 height-48 font-size-15 font-weight-400 line-height-25 color-text'.classNames()}
                    onChange={(e) => setState({ ...state, department_name: e.currentTarget.value })}
                />
            </div>

            <div
                className={'d-flex align-items-center justify-content-end column-gap-21'.classNames()}
            >
                <span
                    className={'font-size-15 font-weight-500 letter-spacing--3 color-text-light cursor-pointer'.classNames()}
                    onClick={() => closeModal()}
                >
                    {__('Cancel')}
                </span>
                <button
                    className={'button button-primary'.classNames()}
                    onClick={() => addNow()}
                    disabled={!state.department_name}
                >
                    {__('Add Department')}
                </button>
            </div>
        </Modal>
    );
}
