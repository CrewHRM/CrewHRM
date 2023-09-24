import { __ } from '../../../utilities/helpers.jsx';

export const attachment_formats = {
    audio: __('Audio'),
    video: __('Video'),
    image: __('Image'),
    pdf: __('PDF'),
    zip: __('ZIP'),
    rar: __('RAR')
};

export const settings_fields = {
    general: {
        label: __('General'),
        description: __(
            'Use these settings to define plugin general settings and default settings for your services and appointments'
        ),
        segments: {
            careers: {
                label: __('Careers'),
                icon: 'ch-icon ch-icon-building-4',
                fields: {
                    careers_page_id: {
                        label: __('Careers Page'),
                        type: 'dropdown',
                        options: 'pages',
                        placeholder: __('Select Page')
                    },
                    careers_header: {
                        label: __('Show Header'),
                        type: 'switch'
                    },
                    careers_tagline: {
                        label: __('Tagline'),
                        type: 'text',
                        when: ['careers_header', true]
                    },
                    careers_hero_image: {
                        label: __('Hero Image'),
                        type: 'image',
                        when: ['careers_header', true]
                    },
                    careers_sidebar: {
                        label: __('Sidebar Filters'),
                        type: 'switch'
                    },
                    careers_search: {
                        label: __('Search Field'),
                        type: 'switch'
                    }
                }
            },
            attachment: {
                label: __('Files & Attachments'),
                icon: 'ch-icon ch-icon-paperclip-2',
                fields: {
                    attachment_formats: {
                        label: __('Attachment upload formats'),
                        type: 'checkbox',
                        direction: 'column',
                        options: Object.keys(attachment_formats).map((format) => {
                            return { id: format, label: attachment_formats[format] };
                        }),
                        hint: __(
                            'Not specifying any removes restriction. To disable upload, turn off attachment per job post.'
                        )
                    },
                    attachment_max_upload_size: {
                        label: __('Job application size (KiloByte)'),
                        type: 'number',
                        min: 1,
                        max: window.CrewHRM.wp_max_size,
                        hint: __(
                            'Total maximum size of resume, attachments and texts combined in job application'
                        )
                    }
                }
            }
        }
    }
};
