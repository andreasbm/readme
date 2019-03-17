import {config, distPath, srcPath} from "./rollup-default.config";

export default {
	...config,
	input: `${srcPath}/cli.ts`,
	output: [
		{
			file: `${distPath}/cli.cjs.js`,
			format: "cjs",
			banner: "#! /usr/bin/env node"
		},
		{
			file: `${distPath}/cli.esm.js`,
			format: "esm",
			banner: "#! /usr/bin/env node"
		}
	]
};