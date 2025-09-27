// vite.config.js
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        // The output directory will be 'dist' in the project root.
        outDir: 'docs',
        rollupOptions: {
            // Tell Vite about all your HTML entry points.
            input: {
                // 'main' is an arbitrary name for this entry point
                main: 'index.html',
                hearts: 'hearts/index.html',
                sueca: 'sueca/index.html',
                king: 'king/index.html',
                sueca_italiana: 'sueca_italiana/index.html',
            },
        },
    },
    // This is still crucial for ensuring asset paths work correctly on a static server.
    base: './',
});