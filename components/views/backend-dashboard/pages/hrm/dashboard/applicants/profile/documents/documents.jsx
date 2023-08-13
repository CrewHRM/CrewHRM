import React, { useContext } from "react";
import { ContextApplicantProfile } from "../profile-wrapper.jsx";
import { ExpandableContent } from "../../../../../../../../materials/ExpandableContent/expandable-content.jsx";
import { __, prepareTexts } from "../../../../../../../../utilities/helpers.jsx";
import { Line } from "../../../../../../../../materials/line/line.jsx";
import { DangerouslySet } from "../../../../../../../../materials/dangerously-set/DangerouslySet.jsx";
import { CoverImage } from "../../../../../../../../materials/image/image.jsx";

import style from './documents.module.scss';

export function Documents() {
	const {applicant} = useContext(ContextApplicantProfile);
	const {cover_letter, resume_url, attachments=[]} = applicant;

	return <div className={'documents'.classNames(style)}>
		<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
			{__( 'COVER LETTER' )}
		</span>
		<ExpandableContent>
			<DangerouslySet className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 text-color-primary'.classNames()}>
				{prepareTexts(cover_letter)}
			</DangerouslySet>
		</ExpandableContent>

		{resume_url && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'RESUME' )}
			</span>
			<object data={resume_url} type="application/pdf" width="100%" height="700px">
				<p>Unable to display PDF file. <a href={resume_url}>Download</a> instead.</p>
			</object>
		</> || null}
		
		{attachments.length && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			<span className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'ATTACHMENTS' )}
			</span>
			<div className={'attachments'.classNames(style)}>
				{attachments.map((attachment, i2)=>{
					let {url, mime_type} = attachment
					return <CoverImage 
								key={i2} 
								className={'flex-1 border-radius-15'.classNames()} 
								src={url} 
								height={125}/>
				})}
			</div>
		</> || null}
	</div>
}
