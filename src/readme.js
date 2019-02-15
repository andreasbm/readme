import colors from "colors";
import argv from "minimist";
import path from "path";
import {config} from "./config.js";
import {
	generateBadges,
	generateBullets,
	generateContributors,
	generateDescription,
	generateInterpolate,
	generateLicense,
	generateLine,
	generateLogo, generateMainTitle,
	generateMarkdown,
	generateTitle,
	generateToc
} from "./generators";
import {generateReadme, readFile, writeFile} from "./helpers";
import {getValue, readJSONFile} from "./helpers.js";

const generators = [
	generateMarkdown,
	generateLogo,
	generateMainTitle,
	generateBadges,
	generateDescription,
	generateBullets,
	generateLine,
	generateContributors,
	generateLicense,
	generateTitle,
	generateInterpolate,
	generateToc
];

// Extract the package
const userArgs = argv(process.argv.slice(2));

// Grab package
const pkgName = path.resolve(userArgs["package"] || config.PACKAGE);
const pkg = readJSONFile(pkgName);

// Grab input
const inputName = path.resolve(userArgs["input"] || getValue(pkg, "readme.input") || config.INPUT);
const input = readFile(inputName);

// Grab output
const output = path.resolve(userArgs["output"] || getValue(pkg, "readme.output") || config.OUTPUT);

// Grab additional user arguments with defaults
const silent = (userArgs["silent"] != null ? userArgs["silent"] : getValue(pkg, "readme.silent")) || config.SILENT;
const dry = (userArgs["dry"] != null ? userArgs["dry"] : getValue(pkg, "readme.dry")) || config.DRY;

// Generate the readme
const readme = generateReadme({pkg, input, generators, silent, inputName, pkgName});

// Write the file
if (!dry) {
	writeFile({target: output, content: readme});

	// Print the success messsage if not silent
	if (!silent) {
		console.log(colors.green(`[readme] - Readme was successfully generated at "${output}".`));
	}

} else {
	console.log(colors.green(`[readme] - Created the following readme but did not write it to any files".`), colors.green(readme));
}
