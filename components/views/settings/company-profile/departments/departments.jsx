import React, { useState } from 'react';
import { __ } from '../../../../utilities/helpers.jsx';
import { ListManager } from '../../../../materials/list-manager/list-manager.jsx';

export function CompantDepartments({onChange, values}) {
	
    return (
        <div>
            <span
                className={'d-block font-size-17 font-weight-600 line-height-24 letter-spacing--17 color-text-light margin-bottom-20'.classNames()}
            >
                {__('Departments')}
            </span>

            <ListManager
                list={values.departments || []}
                onChange={(departments) => onChange('departments', departments)}
                addText={__('Add Department')}
                mode="stack"
            />
        </div>
    );
}
