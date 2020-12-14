import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import * as lodash from "lodash";

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',

  plugins: [
    typescript(),

    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      namedExports: {
        lodash: Object.keys(lodash)
      }
    }),

    sourceMaps()
  ],

  output: [
    {
      file: isDevelopment
        ? 'lib/performanceMonitor.dev.common.js'
        : 'lib/performanceMonitor.prod.common.js',
      format: 'cjs'
    },
    {
      file: 'lib/performanceMonitor.esm.js',
      format: 'es'
    }
  ]
};
