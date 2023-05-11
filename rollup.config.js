import {
  nodeResolve
} from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import fileSize from 'rollup-plugin-filesize'
import {
  babel
} from '@rollup/plugin-babel'

export default {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    babel({
      exclude: './node_modules/**',
      babelHelpers: 'runtime'
    }),
    terser({
      compress: {
        drop_console: process.env.NODE_ENV === 'prod'
      }
    }),
    fileSize()
  ],
  output: [{
      file: 'dist/utils.esm.js',
      format: 'es',
      sourcemap: false
    },
    {
      file: 'dist/utils.cjs.js',
      format: 'cjs',
      name: 'utils',
      sourcemap: false,
      exports: 'named'
    },
    {
      file: 'dist/utils.umd.js',
      format: 'umd',
      name: 'utils',
      sourcemap: false,
      exports: 'named'
    }
  ]
}