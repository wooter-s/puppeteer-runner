import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve'

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    plugins: [
        typescript({ tsconfig: 'tsconfig.build.json' }),
        resolve()
    ],
    external: [
        'puppeteer',
        'dateformat',
        'tracer',
    ]
};
