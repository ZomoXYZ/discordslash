const { build } = require('esbuild');

const define = {
    TOKEN: `"${process.argv[2]}"`
};

build({
    entryPoints: ['examples/main.ts'],
    outfile: 'examples/main.js',

    target: 'es6',
    platform: 'node',
    format: 'cjs',

    define
});