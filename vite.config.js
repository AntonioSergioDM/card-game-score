import {defineConfig} from 'vite';
import handlebars from "vite-plugin-handlebars";

import context from "./context";

const input = {
    main: 'index.html',
};

Object.keys(context).forEach(
    path => input[context[path].identifier] = context[path].identifier + '/index.html'
);

export default defineConfig({
    base: './',
    build: {
        outDir: 'docs',
        rollupOptions: {
            input: input,
        },
    },
    plugins: [
        handlebars(
            {
                partialDirectory: './components',
                context(pagePath) {
                    return context[pagePath] || {context: context};
                },

            }
        ),
    ],
});