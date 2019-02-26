import "./index";

import argv from "minimist";
import { run } from "./readme";

// Extract the package
const userArgs = argv(process.argv.slice(2));
run(userArgs).catch(e => {
	console.log(e);
	process.exit(-1);
});
