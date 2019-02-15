import colors from "colors";
import argv from "minimist";
import path from "path";
import {constructConfig} from "./config";
import {defaultConfig} from "./config.js";
import {
	generateBadges,
	generateBullets,
	generateContributors,
	generateDescription,
	generateInterpolate,
	generateLicense,
	generateLine,
	generateLogo,
	generateMainTitle,
	generateMarkdown,
	generateTitle,
	generateToc, simpleTemplateGenerator
} from "./generators";
import {fileExists, generateReadme, readFile, writeFile} from "./helpers";
import {readJSONFile} from "./helpers.js";

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


/**
 * Generates the readme.
 */
function generate (userArgs) {

	// Grab package
	const pkgName = path.resolve(userArgs["pkgName"] || defaultConfig.pkgName);
	if (!fileExists(pkgName)) {
		console.log(colors.red(`[readme] - Could not find the package file "${pkgName}".`));
		return;
	}

	const pkg = readJSONFile(pkgName);

	// Construct the configuration object
	const config = constructConfig({pkg, pkgName, userArgs, generators});
	const {inputName, outputName, dry, silent, templatesName} = config;

	// Grab input
	if (!fileExists(inputName)) {
		console.log(colors.red(`[readme] - Could not find the input file "${inputName}". Make sure to provide a valid path as either the user arguments --input or in the "readme.input" field in the "${pkgName}" file.`));
		return;
	}

	const input = readFile(inputName);

	// Grab templates
	if (templatesName != null) {
		const templates = readJSONFile(templatesName);
		const simpleTemplateGenerators = templates.map(simpleTemplateGenerator);
		config.generators.unshift(...simpleTemplateGenerators);
	}


	// Generate the readme
	const readme = generateReadme({pkg, input, config});

	// Write the file
	if (!dry) {
		writeFile({target: outputName, content: readme});

		// Print the success messsage if not silent
		if (!silent) {
			console.log(colors.green(`[readme] - A readme file was successfully generated at "${outputName}".`));
		}

	} else {
		console.log(colors.green(`[readme] - Created the following readme but did not write it to any files".`), colors.green(readme));
	}
}

// Extract the package
const userArgs = argv(process.argv.slice(2));
generate(userArgs);

