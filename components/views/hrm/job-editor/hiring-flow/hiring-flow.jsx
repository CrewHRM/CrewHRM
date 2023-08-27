import React, { useState, useEffect } from 'react';
import { __, getRandomString } from '../../../../utilities/helpers.jsx';

import style from './hiring.module.scss';
import { FormActionButtons } from '../../../../materials/form-action.jsx';
import { ListManager } from '../../../../materials/list-manager/list-manager.jsx';
import { DeletionConfirm } from './modal-confirm/model-to-confirm.jsx';

export const sequences = [
    __('Screening'),
    __('Assesment'),
    __('Interview'),
    __('Make an Offer'),
    __('Hired')
].map((s) => {
    return {
        id: getRandomString(),
        label: s
    };
});

export function HiringFlow(props) {
    const { navigateTab } = props;

    const [state, setState] = useState({
        sequences: sequences
    });

    const deleteFlow = (id) => {
        const { sequences = [] } = state;

        if (id !== null) {
            const index = sequences.findIndex((s) => s.id === id);
            sequences.splice(index, 1);
        }

        // Mark the state as modal to close now
        setState({
            ...state,
            sequences,
            confirm_modal_for: null
        });
    };

    return (
        <div data-crewhrm-selector="hiring-flow-builder" className={'hiring'.classNames(style)}>
            {(state.confirm_modal_for && (
                <DeletionConfirm
                    stage={state.sequences.find((s) => s.id == state.confirm_modal_for)}
                    closeModal={() => deleteFlow(null)}
                    deleteFlow={() => deleteFlow(state.confirm_modal_for)}
                />
            )) ||
                null}

            <span
                className={'d-block font-size-20 font-weight-600 color-text margin-bottom-40'.classNames()}
            >
                {__('Hiring stage')}
            </span>

            <ListManager
                list={state.sequences}
                onChange={(sequences) => setState({ ...state, sequences })}
                mode="queue"
                className={'margin-bottom-50'.classNames()}
                deleteItem={(id) => setState({ ...state, confirm_modal_for: id })}
                addText={__('Add Stage')}
            />

            <FormActionButtons onBack={() => navigateTab(-1)} onNext={() => navigateTab(1)} />
        </div>
    );
}
