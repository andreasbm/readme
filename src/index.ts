import argv from "minimist";
import { run } from "./readme";

export * from "./config";
export * from "./helpers.js";
export * from "./readme.js";
export * from "./templates.js";

// Extract the package
const userArgs = argv(process.argv.slice(2));
run(userArgs);
