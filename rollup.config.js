import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';


const createConfig = (srcFile, external = []) => {
    const exportConditions = ['node'];
    return {
        input: `src/${srcFile}.ts`,
        plugins: [
            typescript({ resolveJsonModule: true, allowSyntheticDefaultImports: true, compilerOptions: {module: 'CommonJS'}}),
            nodeResolve({ exportConditions }),
            commonjs({ extensions: ['.js', '.ts'] }),
            json(),
        ],
        output: {
            file: `dist/${srcFile}.js`,
            format: 'cjs',
            strict: false,
        },
        external: [
            /custom\/.+\.js/,
            ...external
        ],
    };
};

export default [
    createConfig('px/humansecurity'),
    createConfig('PXEnforcer', [/px\/humansecurity\.js/]),
    createConfig('PXFirstParty'),
    createConfig('PXActivities', [/px\/perimeterx\.js/]),
];