import React from 'react';

export function IconNotification(props) {
    const { color = window.CrewHRM.colors['text'], size = 24 } = props;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.8975 6.43994V9.76994"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
            />
            <path
                d="M11.9174 2C8.23736 2 5.25736 4.98 5.25736 8.66V10.76C5.25736 11.44 4.97736 12.46 4.62736 13.04L3.35736 15.16C2.57736 16.47 3.11736 17.93 4.55736 18.41C9.33736 20 14.5074 20 19.2874 18.41C20.6374 17.96 21.2174 16.38 20.4874 15.16L19.2174 13.04C18.8674 12.46 18.5874 11.43 18.5874 10.76V8.66C18.5774 5 15.5774 2 11.9174 2Z"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
            />
            <path
                d="M15.2274 19C15.2274 20.83 13.7274 22.33 11.8974 22.33C10.9874 22.33 10.1474 21.95 9.54738 21.35C8.94738 20.75 8.56738 19.91 8.56738 19"
                stroke={color}
                strokeWidth="1.5"
                strokeMiterlimit="10"
            />
        </svg>
    );
}
