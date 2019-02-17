import ts from "@wessberg/rollup-plugin-ts";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

const distPath = "dist";
const srcPath = "src";

export default {
	input: `${srcPath}/index.ts`,
	output: [
		{
			file: `${distPath}/index.cjs.js`,
			format: "cjs",
			sourcemap: true,
		},
		{
			file: `${distPath}/index.esm.js`,
			format: "esm",
			sourcemap: true,
		}
	],
	plugins: [
		resolve({
			module: true,
			browser: true,
			jsnext: true,
			main: false,
			modulesOnly: false
		}),
		ts({
			transpiler: "babel"
		}),
		commonjs({
			include: "**/node_modules/**"
		})
	],
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.devDependencies || {}),
	],
	treeshake: false
};