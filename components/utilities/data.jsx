import { __ } from "./helpers.jsx";

export const genders = {
    male: __('Male'),
    female: __('Female'),
    other: __('Other'),
    decline: __('Decline to self Identity')
};

export const statuses = {
    publish: {
        color: '#73BF45',
        label: __('Published')
    },
    draft: {
        color: '#EE940D',
        label: __('Draft')
    },
    archive: {
        color: '#BBBFC3',
        label: __('Archived')
    },
    expired: {
        color: '#FF180A',
        label: __('Expired')
    }
};
