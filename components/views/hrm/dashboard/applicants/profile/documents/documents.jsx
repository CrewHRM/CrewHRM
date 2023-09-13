import React from 'react';
import { ExpandableContent } from '../../../../../../materials/ExpandableContent/expandable-content.jsx';
import { __, prepareTexts } from '../../../../../../utilities/helpers.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import { DangerouslySet } from '../../../../../../materials/DangerouslySet.jsx';
import { PDFViewer } from '../../../../../../materials/pdf-viewer.jsx';
import { RenderMedia } from '../../../../../../materials/render-media/render-media.jsx';

import pdf from '../../../../../../images/sample.pdf';
import attachment from '../../../../../../images/attachment.png';

const attachments = [
	{
		file_id: 1,
		file_name: 'Sample.png',
		mime_type: 'image/png',
		file_url: attachment
	},
	{
		file_id: 2,
		file_name: 'How to build.jpg',
		mime_type: 'image/jpeg',
		file_url: attachment
	},
	{
		file_id: 3,
		file_name: 'Demo App.jpg',
		mime_type: 'application/zip',
		file_url: attachment
	},
	{
		file_id: 4,
		file_name: 'Banner Design.jpg',
		mime_type: 'image/png',
		file_url: attachment
	},
	{
		file_id: 5,
		file_name: 'Banner Design.jpg',
		mime_type: 'video/mp4',
		file_url: attachment
	},
	{
		file_id: 6,
		file_name: 'Beats Pattern',
		mime_type: 'audio/mp3',
		file_url: attachment
	},
	{
		file_id: 7,
		file_name: 'How to build.pdf',
		mime_type: 'application/pdf',
		file_url: pdf
	},
	{
		file_id: 8,
		file_name: 'Piano Melodic.mp3',
		mime_type: 'audio/mp3',
		file_url: attachment
	},
	{
		file_id: 9,
		file_name: 'Rock Notes Sample',
		mime_type: 'audio/mp3',
		file_url: null
	}
];

export function Documents({ application }) {
    const { cover_letter, resume_file_url } = application;

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
                    {prepareTexts(cover_letter)}
                </DangerouslySet>
            </ExpandableContent>

            {(resume_file_url && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('RESUME')}
                    </span>
                    <PDFViewer src={resume_file_url} />
                </>
            )) ||
                null}

            {(attachments.length && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('ATTACHMENTS')}
                    </span>
                    <RenderMedia media={attachments}/>
                </>
            )) ||
                null}
        </div>
    );
}
