import React, { useState, useEffect, useContext } from 'react';
import { __, getRandomString } from '../../../../utilities/helpers.jsx';

import style from './hiring.module.scss';
import { FormActionButtons } from '../../../../materials/form-action.jsx';
import { ListManager } from '../../../../materials/list-manager/list-manager.jsx';
import { DeletionConfirm } from './model-to-delete.jsx';
import { ContextJobEditor } from '../index.jsx';

export function HiringFlow() {
    const { values = {}, onChange, navigateTab, is_next_disabled } = useContext(ContextJobEditor);
    const hiring_flow = Array.isArray(values.hiring_flow) ? values.hiring_flow : [];

    const [state, setState] = useState({
        to_delete: null
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
            to_delete: null
        });
    };

    const list_manager_stages = hiring_flow
        .filter((f) => {
            // Exclude reserved stages from managable list
            return window.CrewHRM.reserved_stages.indexOf(f.stage_name) === -1;
        })
        .map((f) => {
            // Convert keys to adjust with react list manager
            return {
                stage_id: f.stage_id,
                stage_name: f.stage_name
            };
        });

    return (
        <div data-crewhrm-selector="hiring-flow-builder" className={'hiring'.classNames(style)}>
            {state.to_delete ? (
                <DeletionConfirm
                    job_id={values.job_id}
                    {...hiring_flow.find((s) => s.stage_id == state.to_delete)}
                    closeModal={() => deleteFlow(null)}
                    onDelete={() => deleteFlow(state.to_delete)}
                    moveTo={list_manager_stages
                        .filter((f) => f.stage_id !== state.to_delete)
                        .map((f) => {
                            return { id: f.stage_id, label: f.stage_name };
                        })}
                />
            ) : null}

            <span
                className={'d-block font-size-20 font-weight-600 color-text margin-bottom-40'.classNames()}
            >
                {__('Hiring stage')}
            </span>

            <ListManager
                mode="queue"
                id_key="stage_id"
                label_key="stage_name"
                list={list_manager_stages}
                onChange={(hiring_flow) => onChange('hiring_flow', hiring_flow)}
                readOnyAfter={[{ stage_id: 'a', stage_name: __('Hired') }]}
                className={'margin-bottom-50'.classNames()}
                deleteItem={(id) => setState({ ...state, to_delete: id })}
                addText={__('Add Stage')}
            />

            <FormActionButtons 
				onBack={() => navigateTab(-1)} 
				onNext={() => navigateTab(1)} 
				disabledNext={is_next_disabled}/>
        </div>
    );
}
