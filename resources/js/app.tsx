import './bootstrap';
import '../css/app.css';
import "./i18n"; // import config

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { I18nextProvider } from 'react-i18next'; // ✅ added
import i18n from "./i18n"; // ✅ import instance

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(
                <I18nextProvider i18n={i18n}>   {/* ✅ wrap with provider */}
                    <App {...props} />
                </I18nextProvider>
            );
            return
        }

        hydrateRoot(el,
            <I18nextProvider i18n={i18n}>   {/* ✅ wrap with provider */}
                <App {...props} />
            </I18nextProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
