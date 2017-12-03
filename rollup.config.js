import fs from 'fs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import rootImport from 'rollup-plugin-root-import';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/broadcast.js',
        format: 'umd',
        name: 'Broadcast'
    },
    external: [
        //'vue',
        //'axios'
    ],
    globals: {
        //'vue': 'Vue',
        //'axios': 'axios'
    },
    sourcemap: true,
    sourcemapFile: './dist/.js.map',
    watch: {
        include: './src/**'
    },
    plugins: [
        rootImport({
            // Will first look in `client/src/*` and then `common/src/*`.
            root: `${__dirname}/src`,

            // If we don't find the file verbatim, try adding these extensions
            extensions: ['.js']
        }),
        resolve({
            sourceMap: true,
            extensions: [ '.js']
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        json(),
        babel({
            exclude: 'node_modules/**',
            presets: ['es2015-rollup']
        }),
        serve(),
        livereload({
            watch: './dist/broadcast.js'
        })
    ]
};
