// @ts-check
import { defineConfig } from 'astro/config'
import { createDeriveryFolder } from './src/utils/createDeriveryFolder'
import { editPath } from './src/utils/editPath'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
    server: {
        host: true,
    },
    build: {
        inlineStylesheets: 'never',
        format: 'file',
    },
    integrations: [react(), editPath(), createDeriveryFolder()],
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