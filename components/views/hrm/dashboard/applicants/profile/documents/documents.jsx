import React from 'react';
import { ExpandableContent } from 'crewhrm-materials/ExpandableContent/expandable-content.jsx';
import { __, replaceUrlsWithAnchors, isEmpty } from 'crewhrm-materials/helpers.jsx';
import { Line } from 'crewhrm-materials/line/line.jsx';
import { DangerouslySet } from 'crewhrm-materials/DangerouslySet.jsx';
import { PDFViewer } from 'crewhrm-materials/pdf-viewer.jsx';
import { RenderMedia } from 'crewhrm-materials/render-media/render-media.jsx';
import { Conditional } from 'crewhrm-materials/conditional.jsx';

export function Documents({ application }) {
    const { cover_letter, documents = {} } = application;
    const { resume_url, attachments = [] } = documents;

    return (
        <div data-crewhrm-selector="documents">
			<Conditional show={!isEmpty(cover_letter)}>
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
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('RESUME')}
                    </span>
                    <PDFViewer src={resume_url} />
                </>
            ) : null}

			<Conditional show={attachments.length}>
				<Line className={'margin-top-20 margin-bottom-20'.classNames()} />
				<span
					className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
				>
					{__('ATTACHMENTS')}
				</span>
				<RenderMedia media={attachments} />
			</Conditional>
        </div>
    );
}
