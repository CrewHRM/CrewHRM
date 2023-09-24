import React from 'react';
import { ExpandableContent } from '../../../../../../materials/ExpandableContent/expandable-content.jsx';
import { __, replaceUrlsWithAnchors } from '../../../../../../utilities/helpers.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import { DangerouslySet } from '../../../../../../materials/DangerouslySet.jsx';
import { PDFViewer } from '../../../../../../materials/pdf-viewer.jsx';
import { RenderMedia } from '../../../../../../materials/render-media/render-media.jsx';

export function Documents({ application }) {
    const { cover_letter, documents = {} } = application;
    const { resume_url, attachments = [] } = documents;

    return (
        <div data-crewhrm-selector="documents">
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

            {(attachments.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('ATTACHMENTS')}
                    </span>
                    <RenderMedia media={attachments} />
                </>
            )) ||
                null}
        </div>
    );
}
