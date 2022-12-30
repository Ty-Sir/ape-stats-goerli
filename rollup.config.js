import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dotenv from "rollup-plugin-dotenv";

const packageJson = require("./package.json");
const dev = process.env.NODE_ENV !== "production";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        name: "ape-stats-goerli",
      },
      {
        file: packageJson.module,
        format: "esm",
      },
    ],
    plugins: [
      dotenv(),
      external(),
      resolve(),
      commonjs(),
      nodeResolve(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        plugins: [],
        minimize: true,
      }),
      terser({
        ecma: 2015,
        mangle: { toplevel: true },
        compress: {
          toplevel: true,
          drop_console: !dev,
          drop_debugger: !dev,
        },
        output: { quote_style: 1 },
      }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
