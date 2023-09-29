import React, { useRef, useState } from 'react';

import style from './upload.module.scss';
import { __, getFileId } from '../../utilities/helpers.jsx';
import { ListFile } from '../file-list.jsx';

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
        maxlenth = 1,
        textPrimary = __('Browse'),
        textSecondary = __('or, Just drop it here'),
        value,
        onChange,
        accept=[],
        WpMedia,
        layoutComp
    } = props;

    const singular = maxlenth <= 1;
    const input_ref = useRef();
    const stateFiles = value ? (Array.isArray(value) ? value : [value]) : [];

    /**
     * Setup Crop control
     * The controls used by WordPress Admin are api.CroppedImageControl and api.SiteIconControl.
     */
    const cropControl = {
        id: 'control-id',
        params: {
            flex_width: true, // set to true if the width of the cropped image can be different to the width defined here
            flex_height: true, // set to true if the height of the cropped image can be different to the height defined here
            width: WpMedia?.width, // set the desired width of the destination image here
            height: WpMedia?.height // set the desired height of the destination image here
        }
    };

    const [state, setState] = useState({
        highlight: false
    });

    const _onChange = (files) => {
        onChange(singular ? files[0] : files);
    };

    const handleFiles = (files) => {
        // Convert singulars to array
        if (!(files instanceof FileList)) {
            files = [files];
        }

        // Make sure files exists
        if (!files || !files.length) {
            return;
        }

        files = Array.from(files);
        files = [...files, ...stateFiles];

        // Exclude duplicate
        const ids = [];
        files = files.filter((f) => {
            let id = getFileId(f);
            let exists = ids.indexOf(id) > -1;
            ids.push(id);
            return !exists;
        });

        _onChange(files.slice(0, maxlenth));
    };

    const removeFile = (index) => {
        const _files = stateFiles;
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
        // Open file system media picker if notto use WP API
        if (!WpMedia) {
            input_ref.value = '';
            input_ref.current.click();
            return;
        }

        /**
         * Open Wp Media picker otherwise.
         * For now media picker is statically defined for image.
         * Refactor it later to add suport for other types of files.
         */

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
                    title: __('Select'),
                    library: wp.media.query({ type: 'image' }),
                    multiple: false,
                    date: false,
                    priority: 20,
                    suggestedWidth: WpMedia.width,
                    suggestedHeight: WpMedia.height
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
            handleFiles({
                file_id: croppedImage.id,
                file_url: croppedImage.url,
                file_name: croppedImage.filename,
                mime_type: croppedImage.mime
            });
        });

        /**
         * If cropping was skipped, apply the image data directly to the setting.
         */
        media_frame.on('skippedcrop', function (selection) {
            handleFiles({
                file_id: selection.id,
                file_url: selection.get('url'),
                file_name: selection.get('filename'),
                mime_type: selection.get('mime')
            });
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
                handleFiles({
                    file_id: avatarAttachment.id,
                    file_url: avatarAttachment.url,
                    file_name: avatarAttachment.filename,
                    mime_type: avatarAttachment.mime
                });

                media_frame.close();
            } else {
                media_frame.setState('cropper');
            }
        });

        media_frame.open();
    };

    function Input() {
		
		let _accept = Array.isArray(accept) ? accept : [accept];

		_accept = _accept.map(a=>{
			return (a.indexOf('/')>-1 || a.indexOf('.')===0) ? a : '.'+a;
		}).join(',');

        return (
            <input
                ref={input_ref}
                type="file"
                accept={_accept}
                multiple={!singular}
                className={'d-none'.classNames()}
                onChange={(e) => {
                    handleFiles(e.currentTarget?.files || []);
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

            <ListFile files={stateFiles} style={{ maxWidth: '552px' }} onRemove={removeFile} />
        </>
    );
}
