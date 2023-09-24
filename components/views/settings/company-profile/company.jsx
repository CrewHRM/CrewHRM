import React, { useContext, useState } from 'react';
import { HashRouter, Route, Routes, useParams, Navigate } from 'react-router-dom';

import { WpDashboardFullPage } from '../../../materials/backend-dashboard-container/full-page-container.jsx';
import { ContextBackendDashboard } from '../../hrm/hrm.jsx';
import { StickyBar } from '../../../materials/sticky-bar/sticky-bar.jsx';
import { CompanyProfileSidebar, pages } from './sidebar/sidebar.jsx';
import { CompantDepartments } from './departments/departments.jsx';
import { CompanyProfile } from './profile/profile.jsx';
import { __ } from '../../../utilities/helpers.jsx';
import { ContextHistoryFields, HistoryFields, UndoRedo } from '../../../materials/undo-redo.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';

import style from './company.module.scss';
import { Conditional } from '../../../materials/conditional.jsx';

function CompanyWrapper() {
    const { ajaxToast } = useContext(ContextToast);
    const { sub_page } = useParams();
    const page_id = sub_page || 'profile';

    const { clearHistory, can_go_next, onChange, values } = useContext(ContextHistoryFields);

    const saveCompanyProfile = () => {
        let _action;
        let _payload;

        if (page_id === 'profile') {
            _action = 'save_company_profile';
            _payload = { settings: values[page_id] };
        } else if (page_id === 'departments') {
            _action = 'save_company_departments';
            _payload = {
                departments:
                    values[page_id].departments?.map((d) => {
                        return {
                            department_id: d.id,
                            department_name: d.label
                        };
                    }) ?? []
            };
        }

        request(_action, { ..._payload }, (resp) => {
            ajaxToast(resp);

            if (resp?.success) {
                clearHistory(page_id);
            }
        });
    };

    return (
        <>
            <StickyBar
                backTo={sub_page ? true : false}
                title={pages.find((p) => p.id === page_id)?.label || __('Company Profile')}
            >
                <div className={'d-flex align-items-center column-gap-30'.classNames()}>
                    <UndoRedo segment={page_id} />
                    <button
                        className={'button button-primary'.classNames()}
                        disabled={!can_go_next[page_id]}
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
                    <Conditional show={page_id === 'profile'}>
                        <CompanyProfile
                            onChange={(name, value) => onChange(name, value, page_id)}
                            values={values.profile}
                        />
                    </Conditional>

                    <Conditional show={page_id === 'departments'}>
                        <CompantDepartments
                            onChange={(name, value) => onChange(name, value, page_id)}
                            values={values.departments}
                        />
                    </Conditional>
                </div>
            </div>
        </>
    );
}

export function Company(props) {
    const { departments = [], companyProfile: profile = {} } = props;

    const historyDefaults = {
        departments: {
            departments: departments.map((d) => {
                return {
                    id: d.department_id,
                    label: d.department_name
                };
            })
        },
        profile
    };

    return (
        <ContextBackendDashboard.Provider value={{}}>
            <WpDashboardFullPage>
                <HistoryFields defaultValues={historyDefaults} segmented={true}>
                    <HashRouter>
                        <Routes>
                            <Route
                                path="/company/:sub_page?/"
                                element={<CompanyWrapper {...props} />}
                            />
                            <Route path={'*'} element={<Navigate to="/company/" replace />} />
                        </Routes>
                    </HashRouter>
                </HistoryFields>
            </WpDashboardFullPage>
        </ContextBackendDashboard.Provider>
    );
}
