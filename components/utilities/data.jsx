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

export const attachment_formats = {
    pdf: {
		label: __('PDF'),
	},
	doc: {
		label: __('DOC')
	},
	docx: {
		label: __('DOCX')
	},
    audio: {
		label: __('Audio'),
		disabled: true
	},
    video: {
		label: __('Video'),
		disabled: true
	},
    image: {
		label: __('Image'),
		disabled: true
	},
    zip: {
		label: __('ZIP'),
		disabled: true
	},
    rar: {
		label: __('RAR'),
		disabled: true
	}
};

export const date_formats = ['DD MMM, YYYY', 'Y-MM-D', 'MM/D/Y', 'D/MM/Y'];