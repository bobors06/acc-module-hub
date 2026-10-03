import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        </svg>
    );
}