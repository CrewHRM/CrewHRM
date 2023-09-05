import React, { useState, useEffect, useContext } from 'react';
import { __, getRandomString } from '../../../../utilities/helpers.jsx';

import style from './hiring.module.scss';
import { FormActionButtons } from '../../../../materials/form-action.jsx';
import { ListManager } from '../../../../materials/list-manager/list-manager.jsx';
import { DeletionConfirm } from './modal-confirm/model-to-confirm.jsx';
import { ContextJobEditor } from '../index.jsx';

export function HiringFlow() {
    const { values={}, onChange, navigateTab } = useContext(ContextJobEditor);
	const hiring_flow = Array.isArray( values.hiring_flow ) ? values.hiring_flow : [];

    const [state, setState] = useState({
        confirm_modal_for: null
    });

    const deleteFlow = (id) => {
        const { hiring_flow = [] } = values;

        if (id !== null) {
            const index = hiring_flow.findIndex((s) => s.stage_id === id);
            hiring_flow.splice(index, 1);
        }

        // Mark the state as modal to close now
        onChange('hiring_flow', hiring_flow);

        setState({
            ...state,
            confirm_modal_for: null
        });
    };

    return (
        <div data-crewhrm-selector="hiring-flow-builder" className={'hiring'.classNames(style)}>
            {state.confirm_modal_for ? (
                <DeletionConfirm
                    stage={hiring_flow.find((s) => s.stage_id == state.confirm_modal_for)}
                    closeModal={() => deleteFlow(null)}
                    deleteFlow={() => deleteFlow(state.confirm_modal_for)}
                    moveTo={hiring_flow.filter((f) => f.stage_id !== state.confirm_modal_for)}
                />
            ) : null}

            <span
                className={'d-block font-size-20 font-weight-600 color-text margin-bottom-40'.classNames()}
            >
                {__('Hiring stage')}
            </span>

            <ListManager
                mode="queue"
				newIdKey="stage_id"
				newLabelKey="stage_name"
                list={hiring_flow.filter(f=>f.stage_name!='_disqualified_' && f.stage_name!='_hired_').map(f=>{return {id: f.stage_id, label: f.stage_name}})}
                onChange={(hiring_flow) => onChange('hiring_flow', hiring_flow)}
                readOnyAfter={[{ id: 'a', label: __('Hired') }]}
                className={'margin-bottom-50'.classNames()}
                deleteItem={(id) => setState({ ...state, confirm_modal_for: id })}
                addText={__('Add Stage')}
            />

            <FormActionButtons onBack={() => navigateTab(-1)} onNext={() => navigateTab(1)} />
        </div>
    );
}
