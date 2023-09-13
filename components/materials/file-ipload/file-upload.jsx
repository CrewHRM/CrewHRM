import React, { useRef, useState } from 'react';

import style from './upload.module.scss';
import { __, getRandomString } from '../../utilities/helpers.jsx';

/**
 * Setup Crop control
 * The controls used by WordPress Admin are api.CroppedImageControl and api.SiteIconControl.
 */
const cropControl = {
    id: 'control-id',
    params: {
        flex_width: true, // set to true if the width of the cropped image can be different to the width defined here
        flex_height: true, // set to true if the height of the cropped image can be different to the height defined here
        width: 200, // set the desired width of the destination image here
        height: 200 // set the desired height of the destination image here
    }
};

/**
 * Returns a set of options, computed from the attached image data and
 * control-specific data, to be fed to the imgAreaSelect plugin in
 * wp.media.view.Cropper
 *
 * @param {wp.media.model.Attachment} attachment
 * @param {wp.media.controller.Cropper} controller
 * @returns {object} Options
 */
function media_frame_image_cal(attachment, controller) {
    const control = controller.get('control');

    const realWidth = attachment.get('width');
    const realHeight = attachment.get('height');

    let xInit = parseInt(control.params.width, 10);
    let yInit = parseInt(control.params.height, 10);

    const ratio = xInit / yInit;

    // Enable skip cropping button.
    controller.set('canSkipCrop', true);

    const xImg = xInit;
    const yImg = yInit;

    if (realWidth / realHeight > ratio) {
        yInit = realHeight;
        xInit = yInit * ratio;
    } else {
        xInit = realWidth;
        yInit = xInit / ratio;
    }

    const x1 = (realWidth - xInit) / 2;
    const y1 = (realHeight - yInit) / 2;

    return {
        handles: true,
        keys: true,
        instance: true,
        persistent: true,
        imageWidth: realWidth,
        imageHeight: realHeight,
        minWidth: xImg > xInit ? xInit : xImg,
        minHeight: yImg > yInit ? yInit : yImg,
        x1,
        y1,
        x2: xInit + x1,
        y2: yInit + y1,
        aspectRatio: `${xInit}:${yInit}`
    };
}

export function FileUpload(props) {
    const {
        fileCount = 1,
        textPrimary = __('Browse'),
        textSecondary = __('or, Just drop it here'),
        value: stateFiles = [],
        onChange,
        accept,
        useWpMedia,
        layoutComp
    } = props;

	const singular  = fileCount <= 1;
    const input_ref = useRef();
    const [state, setState] = useState({
        highlight: false
    });

	const _onChange=files=>{
		onChange( singular ? files[0] : files );
	}

    const handleFiles = (files) => {
        let _files = [];

        // Make sure files exists
        if (!files.length) {
            return;
        }

        // Loop thorugh files and generate array with unique id for state purpose
        for (const file of files) {
            _files.push({
                id: file.file_id || getRandomString(),
                file
            });
        }

        // To Do: Validate files

        _onChange([..._files, ...stateFiles].slice(0, fileCount));
    };

    const removeFile = (e, id) => {
        e.stopPropagation();

        const _files = stateFiles;
        const index = stateFiles.findIndex((f) => f.id === id);
        _files.splice(index, 1);
        _onChange(_files);
    };

    const setActionState = (e, highlight) => {
        e.preventDefault();
        setState({
            ...state,
            highlight
        });
    };

    const openPicker = () => {
        if (!useWpMedia) {
            input_ref.current.click();
            return;
        }

        /* Open Wp Media picker otherwise (For now media picker is statically defined for image. Refactor it later to add suport for other types.) */

        /**
         * Create a media modal select frame, we need to set this up every time instead of reusing if already there
         * as the toolbar button does not get reset when doing the following:
         * media_frame.setState('library');
         * media_frame.open();
         */
        const media_frame = wp.media({
            button: {
                text: __('Select'),
                close: false
            },
            states: [
                new wp.media.controller.Library({
                    title: __('Select'), // l10n.selectAndCrop,
                    library: wp.media.query({ type: 'image' }),
                    multiple: false, // We set multiple to false so only get one image from the uploader
                    date: false,
                    priority: 20,
                    suggestedWidth: 200,
                    suggestedHeight: 200
                }),
                new wp.media.controller.CustomizeImageCropper({
                    imgSelectOptions: media_frame_image_cal,
                    control: cropControl
                })
            ]
        });

        /**
         * After the image has been cropped, apply the cropped image data to the setting
         *
         * @param {object} croppedImage Cropped attachment data.
         */
        media_frame.on('cropped', function (croppedImage) {
            const { url: file_url, id: file_id } = croppedImage;

            handleFiles([
                {
                    file_id,
                    file_url
                }
            ]);
        });

        /**
         * If cropping was skipped, apply the image data directly to the setting.
         */
        media_frame.on('skippedcrop', function (selection) {
            handleFiles([
                {
                    file_id: selection.id,
                    file_url: selection.get('url')
                }
            ]);
        });

        /**
         * After an image is selected in the media modal, switch to the cropper
         * state if the image isn't the right size.
         */
        media_frame.on('select', function () {
            const avatarAttachment = media_frame.state().get('selection').first().toJSON();

            if (
                cropControl.params.width === avatarAttachment.width &&
                cropControl.params.height === avatarAttachment.height &&
                !cropControl.params.flex_width &&
                !cropControl.params.flex_height
            ) {
                const { id: file_id, url: file_url } = avatarAttachment;

                handleFiles([
                    {
                        file_id,
                        file_url
                    }
                ]);

                media_frame.close();
            } else {
                media_frame.setState('cropper');
            }
        });

        media_frame.open();
    };

    function Input() {
        return (
            <input
                ref={input_ref}
                type="file"
                accept={accept}
                multiple={!singular}
                className={'d-none'.classNames()}
                onChange={(e) => {
                    handleFiles(e.currentTarget?.files || []);
                    e.currentTarget.value = '';
                }}
            />
        );
    }

    if (layoutComp) {
        return (
            <>
                <Input />
                {layoutComp({ onCLick: openPicker })}
            </>
        );
    }

    return (
        <>
            <div data-crewhrm-selector="file-upload" className={'upload'.classNames(style)}>
                <div
                    className={`drop-container ${state.highlight ? 'highlight' : ''}`.classNames(
                        style
                    )}
                    onDragOver={(e) => setActionState(e, true)}
                    onDragLeave={(e) => setActionState(e, false)}
                    onClick={openPicker}
                    onDrop={(e) => {
                        handleFiles(e?.dataTransfer?.files || []);
                        setActionState(e, false);
                    }}
                >
                    <div className={'margin-bottom-5'.classNames()}>
                        <i
                            className={'ch-icon ch-icon-folder-add font-size-24 color-text'.classNames()}
                        ></i>
                    </div>

                    <span
                        className={'d-block font-size-15 font-weight-600 line-height-20 color-text'.classNames()}
                    >
                        {textPrimary}
                    </span>
                    <span
                        className={'font-size-15 font-weight-400 line-height-20 color-text'.classNames()}
                    >
                        {textSecondary}
                    </span>
                </div>
                <Input />
            </div>
            {stateFiles.map(({ id, file }) => {
                return (
                    <div
                        data-crewhrm-selector="upload-items"
                        key={id}
                        className={'d-flex align-items-center column-gap-14 padding-vertical-10 padding-horizontal-20 margin-top-10 border-radius-10 border-1 b-color-tertiary'.classNames()}
                        style={{ maxWidth: '552px' }}
                    >
                        <span
                            className={'flex-1 font-size-15 font-weight-400 line-height-19 color-text'.classNames()}
                        >
                            {file.name}
                        </span>

                        <i
                            className={'ch-icon ch-icon-times cursor-pointer font-size-15 color-text-lighter color-hover-text'.classNames()}
                            onClick={(e) => removeFile(e, id)}
                        ></i>
                    </div>
                );
            })}
        </>
    );
}
