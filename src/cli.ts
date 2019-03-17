import "./index";

import argv from "minimist";
import { run } from "./readme";

run(process.argv).catch(e => {
	console.log(e);
	process.exit(-1);
});
