import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'vendor_react';
                    }
                    if (id.includes('node_modules/@inertiajs/')) {
                        return 'vendor_inertia';
                    }
                    if (id.includes('node_modules/chart.js/') || id.includes('node_modules/react-chartjs-2/')) {
                        return 'vendor_chartjs';
                    }
                },
            },
        },
    },
});
