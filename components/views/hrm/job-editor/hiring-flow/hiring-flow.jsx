import React, { useState, useEffect, useContext } from 'react';
import { __, data_pointer, getRandomString } from 'crewhrm-materials/helpers.jsx';

import style from './hiring.module.scss';
import { FormActionButtons } from 'crewhrm-materials/form-action.jsx';
import { ListManager } from 'crewhrm-materials/list-manager/list-manager.jsx';
import { DeletionConfirm } from './model-to-delete.jsx';
import { ContextJobEditor } from '../index.jsx';

export function HiringFlow() {
    const { values = {}, onChange, navigateTab, is_next_disabled } = useContext(ContextJobEditor);
    const hiring_flow = Array.isArray(values.hiring_flow) ? values.hiring_flow : [];

	const [deleteID, setDeleteState] = useState(null);

    const deleteFlow = (id) => {
		
		// null will be passed only to close the warning
        if (id !== null) {
			const { hiring_flow = [] } = values;
            const index = hiring_flow.findIndex((s) => s.stage_id === id);
            hiring_flow.splice(index, 1);
				
			// Mark the state as modal to close now
			onChange('hiring_flow', hiring_flow);
        }

		setDeleteState(null);
    };

    const list_manager_stages = hiring_flow
        .filter((f) => {
            // Exclude reserved stages from managable list
            return window[data_pointer].reserved_stages.indexOf(f.stage_name) === -1;
        })
        .map((f) => {
            // Convert keys to adjust with react list manager
            return {
                stage_id: f.stage_id,
                stage_name: __(f.stage_name)
            };
        });

    return (
        <div data-cylector="hiring-flow-builder" className={'hiring'.classNames(style)}>
            {
				!deleteID ? null : (
                <DeletionConfirm
                    job_id={values.job_id}
                    {...hiring_flow.find((s) => s.stage_id == deleteID)}
                    closeModal={() => deleteFlow(null)}
                    onDelete={() => deleteFlow(deleteID)}
                    moveTo={list_manager_stages
                        .filter((f) => f.stage_id !== deleteID)
                        .map((f) => {
                            return { id: f.stage_id, label: __(f.stage_name) };
                        })}
                />)
			}

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
                readOnlyAfter={[{ stage_id: 'a', stage_name: __('Hired') }]}
                className={'margin-bottom-50'.classNames()}
                deleteItem={setDeleteState}
                addText={__('Add Stage')}
            />

            <FormActionButtons
                onBack={() => navigateTab(-1)}
                onNext={() => navigateTab(1)}
                disabledNext={is_next_disabled}
            />
        </div>
    );
}
