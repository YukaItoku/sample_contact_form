// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    server: {
        host: true,
    },
    integrations: [react()],
    vite: {
        build: {
            cssMinify: false
        },
        resolve: {
            alias: {
            '@': new URL('./src', import.meta.url).pathname
            }
        }
    },
});