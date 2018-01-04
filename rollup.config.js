import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/Broadcast.js',
    output: {
        file: 'dist/broadcast.js',
        format: 'umd',
        name: 'Broadcast'
    },
    sourcemap: true,
    sourcemapFile: './dist/.js.map',
    watch: {
        include: './src/**'
    },
    plugins: [
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
