import React from "react";

import { CoverImage } from "../image/image.jsx";

import { IconImage } from '../dynamic-svg/icon-image.jsx';
import { IconAudio } from '../dynamic-svg/icon-audio.jsx';
import { IconVideo } from '../dynamic-svg/icon-video.jsx';
import { IconPDF } from '../dynamic-svg/icon-pdf.jsx';
import { IconZip } from '../dynamic-svg/icon-zip.jsx';

import style from './media.module.scss';
import { getFileId } from "../../utilities/helpers.jsx";

const thumbnails = {
    image: IconImage,
    audio: IconAudio,
    video: IconVideo,
    pdf: IconPDF,
    zip: IconZip,
    other: null
};

export function RenderMedia({media, onDelete, theme='grid', overlay=true}) {
	const attachments = Array.isArray(media) ? media : [media];

	return <div className={`attachments theme-${theme}`.classNames(style)}>
		{attachments.map(attachment => {
			// Declare necessary varaibles
			let file_url, file_name, file_id, mime_type;

			/**
			 * Media format can be only two variants. And it must be maintained everywhere in this app strictly for consistency. 
			 * First one ins instance of File object, second one is {file_id, file_url, file_name} in case of already saved files.
			 */
			if ( attachment instanceof File ) {
				// Instant uploaded file
				file_url  = URL.createObjectURL(attachment);
				file_name = attachment.name;
				file_id   = getFileId(attachment);
				mime_type = attachment.type;

			} else {
				// Already stored file in server
				file_url  = attachment.file_url;
				file_name = attachment.file_name;
				file_id   = attachment.file_id;
				mime_type = attachment.mime_type
			}

			// Determine what to show as thumbnail. Image itself or icon.
			let media_type = mime_type.slice(0, mime_type.indexOf('/'));
			if (media_type === 'application') {
				media_type = mime_type.slice(mime_type.indexOf('/') + 1);
			}

			let is_image    = media_type === 'image';
			let CompIcon    = thumbnails[media_type] || thumbnails.other;
			let thumb_image = is_image ? file_url : null;

			return <div key={file_id} className={'position-relative'.classNames()}>
				{
					onDelete ? <span 
						className={'cursor-pointer bg-color-danger width-16 height-16 d-flex align-items-center justify-content-center position-absolute'.classNames()} 
						style={{borderRadius: '50%', top: '-7px', right: '-7px'}} 
						onClick={onDelete}
					>
						<i className={'ch-icon ch-icon-times color-white font-size-12'.classNames()}></i>
					</span> : null
				}
				<CoverImage
					className={
						'single-attachment'.classNames(style) +
						'flex-1 border-radius-10'.classNames()
					}
					src={thumb_image}
					height={125}
				>
					{(overlay || !thumb_image) ? <div
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
								{CompIcon ? <CompIcon
										color={
											thumb_image
												? 'white'
												: window.CrewHRM.colors['text-lighter']
										}
									/> : null
								}
								<span
									className={`d-block margin-top-5 font-size-13 font-weight-400 line-height-24 letter-spacing--13 line-clamp line-clamp-1 color-${
										is_image ? 'white' : 'light'
									}`.classNames()}
								>
									{file_name}
								</span>
							</div>
						</div> : null
					}
				</CoverImage>
			</div>
		})}
	</div>
}