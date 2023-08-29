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
import { ContextHistoryFields, HistoryFields, UndoRedo } from '../../../materials/undo-redo.jsx';
import { request } from '../../../utilities/request.jsx';
import { ContextToast } from '../../../materials/toast/toast.jsx';

import style from './company.module.scss';

function CompanyWrapper() {
    const { nonce, nonceAction } = useContext(ContextNonce);
    const { ajaxToast } = useContext(ContextToast);
    const { sub_page } = useParams();
    const page_id = sub_page || 'profile';
	const segment = page_id === 'profile' ? 'companyProfile' : 'departments';

	const {
		clearHistory, 
		can_go_next, 
		onChange, 
		values

	} = useContext(ContextHistoryFields);


    const saveCompanyProfile = () => {
		let _action;
		let _payload;

		if ( segment==='companyProfile' ) {
			_action = 'save_company_profile',
			_payload = {settings: values[segment]};
		} else {
			_action = 'save_company_departments';
			_payload = {departments: values[segment].departments};
		}
		
        request(_action, { ..._payload, nonce, nonceAction }, (resp) => {

			ajaxToast(resp);
			
            if ( resp?.success ) {
				clearHistory(segment);
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
                    <UndoRedo segment={segment}/>
                    <button
                        className={'button button-primary'.classNames()}
                        disabled={!can_go_next[segment]}
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
                        <CompanyProfile 
							onChange={(name, value)=>onChange(name, value, 'companyProfile')} 
							values={values[segment]} />
                    )) ||
                        null}

                    {(page_id === 'departments' && <CompantDepartments 
						onChange={(name, value)=>onChange(name, value, 'departments')} 
						values={values[segment]}/>) || null}
                </div>
            </div>
        </>
    );
}

export function Company(props) {
	const {departments={}, companyProfile={}} = props;

    return (
        <ContextBackendDashboard.Provider value={{}}>
            <WpDashboardFullPage>
				<HistoryFields defaultValues={{departments:{departments}, companyProfile}} segmented={true}>
					<HashRouter>
						<Routes>
							<Route path="/company/:sub_page?/" element={<CompanyWrapper {...props} />}/>
							<Route path={'*'} element={<Navigate to="/company/" replace />} />
						</Routes>
					</HashRouter>
				</HistoryFields>
            </WpDashboardFullPage>
        </ContextBackendDashboard.Provider>
    );
}
