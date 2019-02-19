import { green, red } from "colors";
import argv from "minimist";
import { resolve } from "path";
import { defaultGenerators, defaultPackageName, extendPackageWithDefaults } from "./config";
import { simpleTemplateGenerator } from "./generators";
import { fileExists, generateReadme, readFile, readJSONFile, writeFile } from "./helpers";
import { CommandArgs, IPackage } from "./model";

/**
 * Generates the readme.
 */
async function generate (userArgs: CommandArgs) {

	// Grab package
	const pkgPath = resolve(userArgs["package"] || defaultPackageName);
	if (!fileExists(pkgPath)) {
		console.log(red(`[readme] - Could not find the package file "${pkgPath}".`));
		return;
	}

	const pkg = <IPackage>readJSONFile(pkgPath);

	// Construct the configuration object
	extendPackageWithDefaults({pkg, userArgs});
	const {dry, silent, templates, output} = pkg.readme;

	// Grab blueprint
	let blueprint: string = "";
	if (Array.isArray(pkg.readme.blueprint)) {
		blueprint = pkg.readme.blueprint.join(pkg.readme.lineBreak);

	} else {
		const blueprintPath = resolve(pkg.readme.blueprint);
		if (!fileExists(blueprintPath)) {
			console.log(red(`[readme] - Could not find the blueprint file "${blueprintPath}". Make sure to provide a valid path as either the user arguments --readme.blueprint or in the "readme.blueprint" field in the "${pkgPath}" file.`));
			return;
		}

		blueprint = readFile(blueprintPath);
	}

	// Grab templates
	const generators = [...defaultGenerators];
	if (templates != null) {
		const simpleTemplateGenerators = templates.map(simpleTemplateGenerator);

		// Append the simple generators after the loading generator
		generators.splice(1, 0, ...simpleTemplateGenerators);
	}

	// Generate the readme
	const readme = generateReadme({pkg, blueprint, pkgPath, generators});

	// Write the file
	if (!dry) {
		try {
			await writeFile({target: output, content: readme});

			// Print the success messsage if not silent
			if (!silent) {
				console.log(green(`[readme] - A readme file was successfully generated at "${output}".`));
			}
		} catch (err) {
			console.log(red(`[readme] - Could not generate readme at "${output}"`), err);
		}

	} else {
		console.log(green(`[readme] - Created the following readme but did not write it to any files".`), green(readme));
	}
}

// Extract the package
const userArgs = argv(process.argv.slice(2));
generate(userArgs);

