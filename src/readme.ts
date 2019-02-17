import { green, red } from "colors";
import argv from "minimist";
import { resolve } from "path";
import { constructConfig, defaultConfig } from "./config";
import { generateBadges, generateBullets, generateContributors, generateDescription, generateInterpolate, generateLicense, generateLine, generateLoad, generateLogo, generateMainTitle, generateTitle, generateToc, simpleTemplateGenerator } from "./generators";
import { fileExists, generateReadme, readFile, readJSONFile, writeFile } from "./helpers";

const generators = [
	generateLoad,
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
	const pkgName = resolve(userArgs["pkgName"] || defaultConfig.pkgName);
	if (!fileExists(pkgName)) {
		console.log(red(`[readme] - Could not find the package file "${pkgName}".`));
		return;
	}

	const pkg = readJSONFile(pkgName);

	// Construct the configuration object
	const config = constructConfig({pkg, pkgName, userArgs, generators});
	const {inputName, outputName, dry, silent, templates} = config;

	// Grab input
	if (!fileExists(inputName)) {
		console.log(red(`[readme] - Could not find the input file "${inputName}". Make sure to provide a valid path as either the user arguments --input or in the "readme.input" field in the "${pkgName}" file.`));
		return;
	}

	const input = readFile(inputName);

	// Grab templates
	if (templates != null) {
		const simpleTemplateGenerators = templates.map(simpleTemplateGenerator);

		// Append the simple generators after the loading generator
		config.generators.splice(1, 0, ...simpleTemplateGenerators);
	}


	// Generate the readme
	const readme = generateReadme({pkg, input, config});

	// Write the file
	if (!dry) {
		writeFile({target: outputName, content: readme});

		// Print the success messsage if not silent
		if (!silent) {
			console.log(green(`[readme] - A readme file was successfully generated at "${outputName}".`));
		}

	} else {
		console.log(green(`[readme] - Created the following readme but did not write it to any files".`), green(readme));
	}
}

// Extract the package
const userArgs = argv(process.argv.slice(2));
generate(userArgs);

