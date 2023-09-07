import React from "react";

import style from './warning.module.scss';
import { __ } from "../../utilities/helpers.jsx";
import { LoadingIcon } from "../loading-icon/loading-icon.jsx";

export function Warning({ onCancel, onConfirm, loading=false }) {
    const btn_class =
        'font-size-15 font-weight-400 letter-spacing--3 padding-vertical-10 padding-horizontal-15 border-radius-5 border-1-5 b-color-tertiary cursor-pointer'.classNames();

    return (
        <div className={'confirm'.classNames(style) + 'padding-vertical-40 padding-horizontal-50 text-align-center'.classNames()}>
            <span
                className={'d-block font-size-24 font-weight-500 line-height-32 letter-spacing--3 color-text margin-bottom-30'.classNames()}
            >
                {__("Are you sure, you want to delete this item. We won't be able to recover it.")}
            </span>
            <button
                className={
                    'cancel-button'.classNames(style) + btn_class + 'margin-right-20'.classNames()
                }
                onClick={()=>onCancel()}
            >
                {__('Cancel')}
            </button>
            <button
				disabled={loading}
                className={'delete-button'.classNames(style) + btn_class}
                onClick={()=>onConfirm()}
            >
                {loading ? <LoadingIcon size={18} color={window.CrewHRM.colors.white}/> : __('Delete')}
            </button>
        </div>
    );
}
