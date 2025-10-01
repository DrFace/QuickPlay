import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'dist', // <-- this is the folder Vercel expects
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'resources/js/app.tsx'),
            },
        },
    },
});
