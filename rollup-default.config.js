import ts from "@wessberg/rollup-plugin-ts";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";
import json from "rollup-plugin-json";

export const distPath = "dist";
export const srcPath = "src";

export const config = {
	plugins: [
		resolve({
			module: true,
			browser: true,
			jsnext: true,
			main: false,
			modulesOnly: false
		}),
		json(),
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
