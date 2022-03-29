import { Plugin } from 'esbuild';

//plugin data
export const discordSlashPlugin: Plugin = {
    name: 'discordslash',
    setup(build) {

        //replace every time this library is imported
        build.onResolve({ filter: /^esbuild\-discordslash\-plugin$/ }, args => ({
            path: args.path,
            external: true,
            namespace: 'discordslash'
        }))
        build.onLoad({ filter: /.*/, namespace: 'discordslash' }, () => ({
            contents: JSON.stringify({}),
            loader: 'json',
        }))
    }
}