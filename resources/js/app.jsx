import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const rawAppName = import.meta.env.VITE_APP_NAME || 'DG AD SPACE';
const appName =
    !rawAppName || rawAppName.toLowerCase() === 'laravel'
        ? 'DG AD SPACE'
        : rawAppName;

createInertiaApp({
    title: (title) => {
        const clean = (title || '')
            .replace(/\s*[-|]\s*Laravel$/i, '')
            .replace(/\s*\|\s*Build\.\s*Launch\.\s*Earn\./i, '')
            .trim();

        if (!clean || clean === appName || clean === 'DG AD SPACE') {
            return 'DG AD SPACE';
        }

        if (clean.includes('DG AD SPACE')) {
            return 'DG AD SPACE';
        }

        return `${clean} | DG AD SPACE`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
