import React from 'react';
import { ExpandableContent } from 'crewhrm-materials/expandable-content/expandable-content.jsx';
import { __, replaceUrlsWithAnchors, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { DangerouslySet } from 'crewhrm-materials/dangerously-set.jsx';
import { PDFViewer } from 'crewhrm-materials/pdf-viewer/pdf-viewer.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';
import { Slot } from 'crewhrm-materials/mountpoint.jsx';

export function Documents({ application }) {
    const { cover_letter, documents = {} } = application;
    const { resume_url } = documents;

	const has_cover_letter = !isEmpty(cover_letter);

    return (
        <div data-crew="documents">
			<Slot name="application_documents_view" payload={{application}}>
				<Conditional show={has_cover_letter}>
					<span
						className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
					>
						{__('COVER LETTER')}
					</span>
					<ExpandableContent>
						<DangerouslySet
							className={'d-block font-size-15 font-weight-400 line-height-22 letter-spacing--15 color-text'.classNames()}
						>
							{replaceUrlsWithAnchors(cover_letter)}
						</DangerouslySet>
					</ExpandableContent>
				</Conditional>
				
				{resume_url ? (
					<>
						<Conditional show={has_cover_letter}>
							<Line className={'margin-top-20 margin-bottom-20'.classNames()} />
						</Conditional>
						<span
							className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
						>
							{__('RESUME')}
						</span>
						<PDFViewer src={resume_url} />
					</>
				) : null}
			</Slot>
        </div>
    );
}
