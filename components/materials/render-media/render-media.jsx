import React, { useEffect, useState } from 'react';
import ImageZoom from 'react-image-zooom';

import { CoverImage } from '../image/image.jsx';
import { getFileId, scrollLock } from '../../utilities/helpers.jsx';
import { PDFViewer } from '../pdf-viewer.jsx';

import { IconImage } from '../dynamic-svg/icon-image.jsx';
import { IconAudio } from '../dynamic-svg/icon-audio.jsx';
import { IconVideo } from '../dynamic-svg/icon-video.jsx';
import { IconPDF } from '../dynamic-svg/icon-pdf.jsx';
import { IconZip } from '../dynamic-svg/icon-zip.jsx';

import style from './media.module.scss';

const thumbnails = {
    image: IconImage,
    audio: IconAudio,
    video: IconVideo,
    pdf: IconPDF,
    zip: IconZip,
    other: null
};

export function RenderMedia({ media, onDelete, theme = 'grid', overlay = true }) {
    const attachments = Array.isArray(media) ? media : [media];
    const [state, setState] = useState({
        preview: null
    });

    const openPreview = (e, attachment) => {
        // Don't prevent default if it is not previewable
        if (['image', 'audio', 'video', 'pdf'].indexOf(attachment.media_type) === -1) {
            return;
        }

        e.preventDefault();

        setState({
            ...state,
            preview: attachment
        });
    };

    return (
        <>
            {state.preview ? (
                <RenderMediaPreview
                    attachment={state.preview}
                    onClosePreview={() => setState({ ...state, preview: null })}
                />
            ) : null}

            <div className={`attachments theme-${theme}`.classNames(style)}>
                {attachments.map((attachment) => {
                    // Declare necessary varaibles
                    let file_url, file_name, file_id, mime_type;

                    /**
                     * Media format can be only two variants. And it must be maintained everywhere in this app strictly for consistency.
                     * First one ins instance of File object, second one is {file_id, file_url, file_name} in case of already saved files.
                     */
                    if (attachment instanceof File) {
                        // Instant uploaded file
                        file_url = URL.createObjectURL(attachment);
                        file_name = attachment.name;
                        file_id = getFileId(attachment);
                        mime_type = attachment.type;
                    } else {
                        // Already stored file in server
                        file_url = attachment.file_url;
                        file_name = attachment.file_name;
                        file_id = attachment.file_id;
                        mime_type = attachment.mime_type;
                    }

                    // Determine media type
                    let media_type = mime_type.slice(0, mime_type.indexOf('/'));
                    if (media_type === 'application') {
                        media_type = mime_type.slice(mime_type.indexOf('/') + 1);
                    }

                    // Determine what to show as thumbnail. Image itself or icon.
                    let is_image = media_type === 'image';
                    let CompIcon = thumbnails[media_type] || thumbnails.other;
                    let thumb_image = is_image ? file_url : null;

                    return (
                        <div key={file_id} className={'position-relative'.classNames()}>
                            {onDelete ? (
                                <span
                                    className={'cursor-pointer bg-color-error width-16 height-16 d-flex align-items-center justify-content-center position-absolute'.classNames()}
                                    style={{ borderRadius: '50%', top: '-7px', right: '-7px' }}
                                    onClick={onDelete}
                                >
                                    <i
                                        className={'ch-icon ch-icon-times color-white font-size-12'.classNames()}
                                    ></i>
                                </span>
                            ) : null}
                            <CoverImage
                                className={
                                    'single-attachment'.classNames(style) +
                                    'flex-1 border-radius-10'.classNames()
                                }
                                src={thumb_image}
                                height={125}
                            >
                                {overlay || !thumb_image ? (
                                    <a
                                        href={file_url}
                                        target="_blank"
                                        style={{ color: 'inherit' }}
                                        onClick={(e) =>
                                            openPreview(e, { ...attachment, media_type })
                                        }
                                        className={
                                            `attachment-overlay ${
                                                thumb_image ? 'has-thumbnail' : ''
                                            }`.classNames(style) +
                                            `d-block w-full h-full d-flex align-items-center justify-content-center padding-20 cursor-pointer ${
                                                thumb_image
                                                    ? ''
                                                    : 'border-1-5 b-color-tertiary border-radius-10'
                                            }`.classNames()
                                        }
                                    >
                                        <div
                                            className={'d-inline-block text-align-center'.classNames()}
                                        >
                                            {CompIcon ? (
                                                <CompIcon
                                                    color={
                                                        thumb_image
                                                            ? 'white'
                                                            : window.CrewHRM.colors['text-lighter']
                                                    }
                                                />
                                            ) : null}
                                            <span
                                                className={`d-block margin-top-5 font-size-13 font-weight-400 line-height-24 letter-spacing--13 line-clamp line-clamp-1 ${
                                                    is_image ? 'color-white' : 'color-text-light'
                                                }`.classNames()}
                                            >
                                                {file_name}
                                            </span>
                                        </div>
                                    </a>
                                ) : null}
                            </CoverImage>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export function RenderMediaPreview(props) {
    const {
        attachment: { mime_type, media_type, file_url },
        onClosePreview
    } = props;

    useEffect(() => {
        scrollLock(true);
        return () => scrollLock(false);
    });

    return (
        <div
            className={
                `preview media-type-${media_type}`.classNames(style) +
                'position-fixed left-0 right-0 top-0 bottom-0 w-full h-full padding-50'.classNames()
            }
            onClick={onClosePreview}
        >
            <span
                className={'cursor-pointer bg-color-error width-20 height-20 d-flex align-items-center justify-content-center position-fixed top-42 right-42'.classNames()}
                style={{ borderRadius: '50%', zIndex: 9992 }}
                onClick={onClosePreview}
            >
                <i className={'ch-icon ch-icon-times color-white font-size-12'.classNames()}></i>
            </span>
            <div
                className={'w-full h-full d-flex align-items-center justify-content-center'.classNames()}
                onClick={(e) => e.stopPropagation()}
            >
                {media_type === 'image' ? <ImageZoom src={file_url} zoom="180" /> : null}

                {media_type === 'pdf' ? (
                    <PDFViewer src={file_url} height="100%" defaultScale={1} />
                ) : null}

                {media_type === 'audio' ? (
                    <audio autoPlay={true} controls={true} className={'w-full'.classNames()}>
                        <source src={file_url} type={mime_type} />
                        Your browser does not support the audio element.
                    </audio>
                ) : null}

                {media_type === 'video' ? (
                    <video autoPlay={true} controls={true} className={'w-full h-full'.classNames()}>
                        <source src={file_url} type={mime_type} />
                        Your browser does not support the audio element.
                    </video>
                ) : null}
            </div>
        </div>
    );
}
