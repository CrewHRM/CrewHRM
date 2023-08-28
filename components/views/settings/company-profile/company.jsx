import React, { useContext, useState } from 'react';
import { HashRouter, Route, Routes, useParams, Navigate } from 'react-router-dom';

import { WpDashboardFullPage } from '../../../materials/backend-dashboard-container/full-page-container.jsx';
import { ContextBackendDashboard } from '../../hrm/hrm.jsx';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { CompanyProfileSidebar, pages } from './sidebar/sidebar.jsx';
import { CompantDepartments } from './departments/departments.jsx';
import { CompanyProfile } from './profile/profile.jsx';
import { ContextNonce } from '../../../materials/mountpoint.jsx';
import { __ } from '../../../utilities/helpers.jsx';
import { UndoRedo, addToHistory } from '../../../materials/undo-redo.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';

import style from './company.module.scss';

function CompanyWrapper({ companyProfile = {} }) {
    const { nonce, nonceAction } = useContext(ContextNonce);
    const { addToast } = useContext(ContextToast);
    const { sub_page } = useParams();
    const page_id = sub_page || 'profile';

    const [state, setState] = useState({
        index: 0,
        logo_url: companyProfile.log,
        history: [companyProfile]
    });

    const onChange = (name, value) => {
        const { index, history } = state;

		const obj_value = typeof name==='object' ? name : {[name]: value};

        // Finally update state
        setState({
            ...state,
            ...addToHistory(obj_value, { index, history })
        });
    };

    const saveCompanyProfile = () => {
        const values = state.history[state.index];
        request('save_company_profile', { settings: values, nonce, nonceAction }, (resp) => {
            const { success, data } = resp;

            if (!success) {
                addToast(data?.message || __('Something went wrong!'));
                return;
            }

            // Show success toast
            addToast(__('Seetings saved successfully!'));

            // Clear the dirty state and store the saved value as the basis
            setState({
                index: 0,
                history: [values]
            });
        });
    };

    const values = state.history[state.index] || {};

    return (
        <>
            <StickyBar
                backTo={sub_page ? true : false}
                title={pages.find((p) => p.id === page_id)?.label || __('Company Profile')}
            >
                <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                    <UndoRedo
                        historyLength={state.history.length}
                        index={state.index}
                        onChange={(index) => setState({ ...state, index })}
                    />
                    <button
                        className={'button button-primary'.classNames()}
                        disabled={state.index < 0}
                        onClick={saveCompanyProfile}
                    >
                        {__('Save Changes')}
                    </button>
                </div>
            </StickyBar>
            <div className={'company'.classNames(style) + 'padding-horizontal-15'.classNames()}>
                <div className={'sidebar'.classNames(style)}>
                    <CompanyProfileSidebar page_id={page_id} />
                </div>
                <div className={'content-area'.classNames(style)}>
                    {(page_id === 'profile' && (
                        <CompanyProfile onChange={onChange} values={values} />
                    )) ||
                        null}
                    {(page_id === 'departments' && <CompantDepartments />) || null}
                </div>
            </div>
        </>
    );
}

export function Company(props) {
    return (
        <ContextBackendDashboard.Provider value={{}}>
            <WpDashboardFullPage>
                <HashRouter>
                    <Routes>
                        <Route
                            path="/company/:sub_page?/"
                            element={<CompanyWrapper {...props} />}
                        />
                        <Route path={'*'} element={<Navigate to="/company/" replace />} />
                    </Routes>
                </HashRouter>
            </WpDashboardFullPage>
        </ContextBackendDashboard.Provider>
    );
}
