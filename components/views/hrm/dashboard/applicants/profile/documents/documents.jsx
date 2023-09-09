import React from 'react';
import { ExpandableContent } from '../../../../../../materials/ExpandableContent/expandable-content.jsx';
import { __, prepareTexts } from '../../../../../../utilities/helpers.jsx';
import { Line } from '../../../../../../materials/line/line.jsx';
import { DangerouslySet } from '../../../../../../materials/DangerouslySet.jsx';
import { CoverImage } from '../../../../../../materials/image/image.jsx';
import { PDFViewer } from '../../../../../../materials/pdf-viewer.jsx';

import { IconImage } from '../../../../../../materials/dynamic-svg/icon-image.jsx';
import { IconAudio } from '../../../../../../materials/dynamic-svg/icon-audio.jsx';
import { IconVideo } from '../../../../../../materials/dynamic-svg/icon-video.jsx';
import { IconPDF } from '../../../../../../materials/dynamic-svg/icon-pdf.jsx';
import { IconZip } from '../../../../../../materials/dynamic-svg/icon-zip.jsx';

import style from './documents.module.scss';

const thumbnails = {
    image: IconImage,
    audio: IconAudio,
    video: IconVideo,
    pdf: IconPDF,
    zip: IconZip,
    other: null
};

export function Documents({ applicant }) {
    const { cover_letter, resume_url, attachments = [] } = applicant;

    return (
        <div data-crewhrm-selector="documents" className={'documents'.classNames(style)}>
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

            {(resume_url && (
                <>
                    <Line className={'margin-top-20 margin-bottom-20'.classNames()} />
                    <span
                        className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text margin-bottom-10'.classNames()}
                    >
                        {__('RESUME')}
                    </span>
                    <PDFViewer src={resume_url} />
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
                    <div className={'attachments'.classNames(style)}>
                        {attachments.map((attachment, i2) => {
                            let { url, name, mime_type = '' } = attachment;

                            let media_type = mime_type.slice(0, mime_type.indexOf('/'));
                            if (media_type === 'application') {
                                media_type = mime_type.slice(mime_type.indexOf('/') + 1);
                            }

                            let is_image = media_type === 'image';
                            let CompIcon = thumbnails[media_type] || thumbnails.other;
                            let thumb_image = is_image ? url : null;

                            return (
                                <CoverImage
                                    key={i2}
                                    className={
                                        'single-attachment'.classNames(style) +
                                        'flex-1 border-radius-10'.classNames()
                                    }
                                    src={thumb_image}
                                    height={125}
                                >
                                    <div
                                        className={
                                            `attachment-overlay ${
                                                thumb_image ? 'has-thumbnail' : ''
                                            }`.classNames(style) +
                                            `w-full h-full d-flex align-items-center justify-content-center padding-20 cursor-pointer ${
                                                thumb_image
                                                    ? ''
                                                    : 'border-1-5 b-color-tertiary border-radius-10'
                                            }`.classNames()
                                        }
                                    >
                                        <div
                                            className={'d-inline-block text-align-center'.classNames()}
                                        >
                                            {(CompIcon && (
                                                <CompIcon
                                                    color={
                                                        thumb_image
                                                            ? 'white'
                                                            : window.CrewHRM.colors['text-lighter']
                                                    }
                                                />
                                            )) ||
                                                null}
                                            <span
                                                className={`d-block margin-top-5 font-size-13 font-weight-400 line-height-24 letter-spacing--13 line-clamp line-clamp-1 color-${
                                                    is_image ? 'white' : 'light'
                                                }`.classNames()}
                                            >
                                                {name}
                                            </span>
                                        </div>
                                    </div>
                                </CoverImage>
                            );
                        })}
                    </div>
                </>
            )) ||
                null}
        </div>
    );
}
