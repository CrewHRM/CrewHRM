import React, { useContext } from "react";
import { ContextApplicantProfile } from "../profile-wrapper.jsx";
import { __, getSocialIcon, prepareTexts } from "../../../../../../../../utilities/helpers.jsx";
import { Line } from "../../../../../../../../materials/line/line.jsx";
import { DangerouslySet } from "../../../../../../../../materials/dangerously-set/DangerouslySet.jsx";

// To Do: Output contents should be converted html entities from PHP using htmlspecialchars function.

export function OverView() {
	const {applicant={}} = useContext(ContextApplicantProfile);
	const {summary, education=[], skills=[], qna=[], social_links=[]} = applicant;

	return <div>
		<strong className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
			{__( 'SUMMARY' )}
		</strong>
		<div>
			<DangerouslySet className={'font-size-15 font-weight-400 line-height-22 letter-spacing-15 text-color-primary'.classNames()}>
				{prepareTexts(summary)}
			</DangerouslySet>
		</div>

		{education.length && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			<strong className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'EDUCATION' )}
			</strong>
			<div>
				{education.map(ed=>{
					let {education_id, date_from, date_to, degree, institute} = ed;

					return <div key={education_id} className={'d-flex margin-bottom-10'.classNames()}>
						<div style={{width: '150px'}}>
							<span className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 text-color-secondary'.classNames()}>
								{new Date(date_from).getFullYear()} - {new Date(date_to).getFullYear()}
							</span>
						</div>
						<div className={'flex-1'.classNames()}>
							<span className={'font-size-15 font-weight-400 line-height-24 letter-spacing--15 text-color-primary'.classNames()}>
								{degree} <span className={'text-color-secondary'.classNames()}>at</span> {institute}
							</span>
						</div>
					</div>
				})}
			</div>
		</> || null}

		{skills.length && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			<strong className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 text-color-primary margin-bottom-10'.classNames()}>
				{__( 'SKILLS' )}
			</strong>
			<div style={{marginBottom: '-15px'}}>
				{skills.map(skill=>{
					return <div key={skill} className={'tag margin-right-15 margin-bottom-15'.classNames()}>
						{skill}
					</div>
				})}
			</div>
		</> || null}
		
		{qna.length && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			{qna.map((q, i)=>{
				let {qna_id, question, answer} = q;
				return <div key={qna_id}>
					<strong className={'d-block font-size-17 font-weight-500 line-height-24 letter-spacing--17 text-color-primary margin-bottom-1'.classNames()}>
						{question}
					</strong>
					<DangerouslySet className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 text-color-primary'.classNames()}>
						{prepareTexts( answer )}
					</DangerouslySet>
					
					<Line className={'margin-top-20 margin-bottom-20'.classNames()} show={i < qna.length-1}/>
				</div>
			})}
		</> || null}

		{social_links.length && <>
			<Line className={'margin-top-20 margin-bottom-20'.classNames()}/>
			{[...new Set( social_links )].map(link=>{
				return <a key={link} href={link} rel="noopener noreferrer nofollow" target="_blank" className={'d-inline-block margin-right-20'.classNames()}>
					<i className={getSocialIcon(link) + 'font-size-20 text-color-primary'.classNames()}></i>
				</a>
			})}
		</> || null}
	</div>
}