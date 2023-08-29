import React, { useState, useEffect, useContext } from 'react';
import { __, getRandomString } from '../../../../utilities/helpers.jsx';

import style from './hiring.module.scss';
import { FormActionButtons } from '../../../../materials/form-action.jsx';
import { ListManager } from '../../../../materials/list-manager/list-manager.jsx';
import { DeletionConfirm } from './modal-confirm/model-to-confirm.jsx';
import { ContextJobEditor } from '../index.jsx';

export function HiringFlow() {
    const { values, onChange, navigateTab } = useContext(ContextJobEditor);

    const [state, setState] = useState({
        confirm_modal_for: null
    });

    const deleteFlow = (id) => {
        const { hiriging_flow = [] } = values;

        if (id !== null) {
            const index = hiriging_flow.findIndex((s) => s.id === id);
            hiriging_flow.splice(index, 1);
        }

        // Mark the state as modal to close now
        onChange('hiriging_flow', hiriging_flow);

        setState({
            ...state,
            confirm_modal_for: null
        });
    };

    return (
        <div data-crewhrm-selector="hiring-flow-builder" className={'hiring'.classNames(style)}>
            {state.confirm_modal_for ? (
                <DeletionConfirm
                    stage={values.hiriging_flow.find((s) => s.id == state.confirm_modal_for)}
                    closeModal={() => deleteFlow(null)}
                    deleteFlow={() => deleteFlow(state.confirm_modal_for)}
                    moveTo={values.hiriging_flow.filter((f) => f.id !== state.confirm_modal_for)}
                />
            ) : null}

            <span
                className={'d-block font-size-20 font-weight-600 color-text margin-bottom-40'.classNames()}
            >
                {__('Hiring stage')}
            </span>

            <ListManager
                mode="queue"
                list={values.hiriging_flow}
                onChange={(hiriging_flow) => onChange('hiriging_flow', hiriging_flow)}
                readOnyAfter={[{ id: 'a', label: __('Hired') }]}
                className={'margin-bottom-50'.classNames()}
                deleteItem={(id) => setState({ ...state, confirm_modal_for: id })}
                addText={__('Add Stage')}
            />

            <FormActionButtons onBack={() => navigateTab(-1)} onNext={() => navigateTab(1)} />
        </div>
    );
}
