import React, { useContext } from 'react';

import { __, countries_array } from '../../../../../utilities/helpers.jsx';
import {
    input_class,
    section_title_class,
    field_label_class
} from '../job-details.jsx';
import style from '../details.module.scss';
import { DropDown } from '../../../../../materials/dropdown/dropdown.jsx';
import { TagField } from '../../../../../materials/tag-field/tag-field.jsx';
import { ContextJobEditor } from '../../index.jsx';

const location_types = {
    on_site: __('On-Site'),
    remote: __('Fully Remote'),
    hybrid: __('Hybrid')
};

export function Location() {
    const { values, onChange } = useContext(ContextJobEditor);

    return (
        <>
            {/* Location */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={section_title_class}>{__('Location')}</span>
                </div>
            </div>

            {/* Job Locations */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={field_label_class}>{__('Job Location type')}</span>
                    <TagField
                        theme="button-control"
                        behavior="checkbox"
                        value={values.location_type || []}
                        options={Object.keys(location_types).map((location) => {
                            return { id: location, label: location_types[location] };
                        })}
                        onChange={(types) => onChange('location_type', types)}
                    />
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1'.classNames()}>
                    <span className={field_label_class}>{__('Street Address')}</span>
                    <div>
                        <input
                            type="text"
                            placeholder={__('ex. New York, NY 00010, USA')}
                            className={input_class}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}>
                    <span className={field_label_class}>&nbsp;</span>
                    <span className={'font-size-13 font-weight-400 color-text-light'.classNames()}>
                        {__('Use a location to attract the most appropriate candidates')}
                    </span>
                </div>
            </div>

            {/* Job Title */}
            <div className={'d-flex margin-bottom-30'.classNames()}>
                <div className={'flex-1 d-flex'.classNames()}>
                    <div className={'flex-1 margin-right-10'.classNames()}>
                        <span className={field_label_class + 'white-space-nowrap'.classNames()}>
                            {__('Zip/Postal Code')}
                        </span>
                        <input
                            type="text"
                            className={input_class}
                            placeholder={__('ex. NY 00010')}
                        />
                    </div>
                    <div className={'flex-1 margin-left-10'.classNames()}>
                        <span className={field_label_class}>{__('Country')}</span>
                        <DropDown
                            value={values.country_code}
                            options={countries_array}
                            onChange={(v) => onChange('country_code', v)}
                            className={input_class}
                        />
                    </div>
                </div>
                <div className={'right-col'.classNames(style)}></div>
            </div>
        </>
    );
}
