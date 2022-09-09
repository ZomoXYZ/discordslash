const { build } = require('esbuild');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your token: ', (token) => {
    rl.close();

    const define = {
        TOKEN: `"${token}"`
    };

    console.log('Building...');

    build({
        entryPoints: ['examples/main.ts'],
        outfile: 'examples/main.js',

        target: 'es6',
        platform: 'node',
        format: 'cjs',

        define
    }).then(() => {
        console.log('Done!');
    }).catch((err) => {
        console.error(err);
    });

});