import { tz } from 'moment-timezone';
import icons from '../icons/crewhrm/style.module.scss';

export function getElementDataSet(element) {
    let { dataset = {} } = element;
    let data = {};

    for (let k in dataset) {
        let _json;
        try {
            _json = JSON.parse(dataset[k]);
        } catch (error) {}

        data[k] = _json ? _json : dataset[k];
    }

    return data;
}

export function getRandomString() {
    const timestamp = new Date().getTime().toString();
    const randomPortion = Math.random().toString(36).substring(2);
    return '_' + timestamp + randomPortion;
}

export function __(txt) {
    const { __ } = window.wp?.i18n || {};
    return typeof __ == 'function' ? __(txt, 'crewhrm') : txt;
}

export function sprintf(str, ...params) {
    let find = '%s';

    while (true) {
        let replace = params.shift();
        if (replace === undefined || str.indexOf(find) === -1) {
            break;
        }

        str = str.replace(find, replace);
    }

    return str;
}

export function getFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

export function prepareTexts(inputText, props = {}) {
    if (typeof inputText !== 'string') {
        return inputText;
    }

    let { className = '' } = props;

    // To Do: Fix malformed url if comma, dot is right after the url without space in between.

    // Regular expression to match URLs
    let urlRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;

    // Replace URLs with anchor tags
    let replacedText = inputText.replace(urlRegex, function (url) {
        return `<a href="${url}" rel="noopener noreferrer nofollow" target="_blank" class="${className}">
			${url}
		</a>`;
    });

    replacedText = replacedText.replaceAll('\n', '<br/>');

    return replacedText;
}

export function getSocialIcon(url) {
    const { host } = new URL(url);
    const brand = host.slice(0, host.indexOf('.'));
    const class_name = 'ch-icon-' + brand;
    const final_class = `ch-icon ${icons[class_name] ? class_name : 'ch-icon-anchor'}`.classNames();

    return final_class;
}

export function getCountries(ret_array = false, lang = 'en') {
    const A = 65;
    const Z = 90;
    const countryName = new Intl.DisplayNames([lang], { type: 'region' });
    const countries = {};
    const countries_array = [];

    for (let i = A; i <= Z; ++i) {
        for (let j = A; j <= Z; ++j) {
            let code = String.fromCharCode(i) + String.fromCharCode(j);
            let name = countryName.of(code);
            if (code !== name) {
                if (ret_array) {
                    countries_array.push({
                        id: code,
                        label: name
                    });
                } else {
                    countries[code] = name;
                }
            }
        }
    }

    return ret_array ? countries_array : countries;
}

export function copyToClipboard(text, addToast) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            addToast(__('Copied to clipboard'));
        })
        .catch((error) => {
            addToast(__('Error copying to clipboard'));
        });
}

export function getInitials(name) {
    const words = name.trim().split(' ');

    if (words.length === 0) {
        return '';
    }

    const initials = words
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);

    return initials;
}

export function generateBackgroundColor(name) {
    const colors = [
        '#FFC0CB', // Pink
        '#87CEEB', // Sky Blue
        '#98FB98', // Pale Green
        '#FFD700', // Gold
        '#FFA07A', // Light Salmon
        '#7B68EE' // Medium Slate Blue
    ];

    const initials = name.trim().substring(0, 2).toUpperCase();
    const charCodeSum = Array.from(initials)
        .map((char) => char.charCodeAt(0))
        .reduce((sum, charCode) => sum + charCode, 0);

    const colorIndex = charCodeSum % colors.length;
    return colors[colorIndex];
}

export const is_production = process.env.NODE_ENV === 'production';
export const countries_array = getCountries(true);
export const timezones_array = tz.names().map((z) => {
    return { id: z, label: z };
});
