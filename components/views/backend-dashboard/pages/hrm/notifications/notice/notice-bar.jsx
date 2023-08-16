import React, { useContext } from "react";
import { ContextBackendDashboard } from "../../hrm.jsx";

import style from './notice.module.scss';

export function NoticeBar() {
	const {notices=[], deleteNotice} = useContext(ContextBackendDashboard);
	
	return !notices.length && null || <>
		{notices.map(notice=>{
			let {id, content, type} = notice;
			
			return <div key={id} className={'d-flex align-items-center justify-content-center padding-vertical-8 padding-horizontal-20 w-full margin-bottom-2'.classNames() + `notice ${type}`.classNames(style)}>
				<div>
					{content}
				</div>
				<i className={'ch-icon ch-icon-times font-size-24 text-color-white cursor-pointer position-absolute right-18'.classNames()} onClick={()=>deleteNotice(id)}></i>
			</div>
		})}
	</>
}