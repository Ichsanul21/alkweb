import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        let pageData = props.initialPage;
        
        // Custom parser for Base64 injected string
        if (!pageData && window.__INERTIA_PAGE__) {
            try {
                pageData = JSON.parse(decodeURIComponent(escape(window.atob(window.__INERTIA_PAGE__))));
                
                // Clear the variable after parsing so it doesn't linger in DOM memory easily
                window.__INERTIA_PAGE__ = undefined;
            } catch (e) {
                console.error("Failed to parse Inertia page data.");
            }
        }

        const appProps = { ...props, initialPage: pageData };

        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...appProps} />);
            return;
        }

        createRoot(el).render(<App {...appProps} />);
    },
    progress: {
        color: '#4B5563',
    },
});
