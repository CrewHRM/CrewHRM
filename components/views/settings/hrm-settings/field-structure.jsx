import { __ } from '../../../utilities/helpers.jsx';

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
            }
        }
    }
};
