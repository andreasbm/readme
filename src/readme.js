import colors from "colors";
import argv from "minimist";
import path from "path";
import {CONFIG} from "./config.js";
import {
	generateBadges,
	generateBullets,
	generateDescription, generateLicense,
	generateLogo, generateSections,
	generateTableOfContents,
	generateTitle,
	generateContributors
} from "./generators";
import {generateReadme, getValue, readJSONFile, writeFile} from "./helpers.js";

/**
 * Generators for the readme.
 * @type {*[]}
 */
const GENERATORS = [
	generateLogo,
	generateTitle,
	generateBadges,
	generateDescription,
	generateBullets,
	generateTableOfContents,
	generateSections,
	generateContributors,
	generateLicense
];


// Extract the package
const userArgs = argv(process.argv.slice(2));
const pkgName = path.resolve(userArgs["input"] || CONFIG.INPUT);
const pkg = readJSONFile(pkgName);


// Grab the user arguments with defaults
const target = path.resolve(userArgs["output"] || getValue(pkg, "readme.output") || CONFIG.OUTPUT);
const silent = (userArgs["silent"] != null ? userArgs["silent"] : getValue(pkg, "readme.silent")) || CONFIG.SILENT;
const dry = (userArgs["dry"] != null ? userArgs["dry"] : getValue(pkg, "readme.dry")) || CONFIG.DRY;

// Generate readme
const readme = generateReadme({pkg, pkgName, generators: GENERATORS});

// Write the file
if (!dry) {
	writeFile({target, content: readme});

	// Print the success messsage if not silent
	if (!silent) {
		console.log(colors.green(`[readme] - Readme was successfully generated at "${target}".`));
	}
} else {
	console.log(colors.green(`[readme] - Created the following readme but did not write it to any files".`), colors.green(readme));
}