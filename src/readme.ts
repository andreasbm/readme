import { green, red, yellow } from "colors";
import commandLineUsage from "command-line-usage";
import { resolve } from "path";
import { defaultGenerators, defaultPackageName, extendPackageWithDefaults, helpContent } from "./config";
import { simpleTemplateGenerator } from "./generators";
import { extractValues, fileExists, isFunction, readFile, readJSONFile, validateObject, writeFile } from "./helpers";
import { IGenerator, IGeneratorParamsArgs, IGeneratorParamsError, IPackage, Params, UserArgs } from "./model";

/**
 * Generates a readme.
 * @param pkg
 * @param blueprint
 * @param pkgPath
 * @param generators
 */
export function generateReadme ({pkg, blueprint, pkgPath, generators}: {pkg: IPackage, blueprint: string, pkgPath: string, generators: IGenerator<any>[]}): string {

	const {silent} = pkg.readme;

	// Go through all of the generators and replace with the template
	let defaultArgs = {pkg, pkgPath, generateReadme};
	for (const generator of generators) {
		blueprint = blueprint.replace(generator.regex({...defaultArgs, blueprint}), (string, ...matches) => {
			let params: any | null | Params | IGeneratorParamsError = null;

			// If the params are required we extract them from the package.
			if (generator.params != null) {
				let errorReason;
				if (isFunction(generator.params)) {

					// Extract the params using the function
					params = (<(args: IGeneratorParamsArgs) => any>generator.params)({
						...defaultArgs,
						blueprint,
						matches,
						string
					});

					// Validate the params
					if (params == null || params.error) {
						errorReason = (params || {}).error || `the params couldn't not be generated`;
					}

				} else {

					// Get the required and optional parameters
					const optionalParams = (<any>generator.params)["optional"] || [];
					const requiredParams = {...generator.params};
					delete requiredParams["optional"];

					// Validate the params
					if (!validateObject({obj: pkg, requiredFields: (<any>Object).values(requiredParams)})) {
						errorReason = `"${pkgPath}" is missing the keys "${(<any>Object).values(requiredParams)
						                                                                .join(", ")}"`;
					} else {
						params = extractValues({map: {...optionalParams, ...requiredParams}, obj: pkg});
					}
				}

				// If an error occurred print it and continue
				if (errorReason != null) {
					if (!silent) {
						console.log(yellow(`[readme] - The readme generator "${generator.name}" matched "${string}" but was skipped because ${errorReason}.`));
					}

					return string;
				}
			}

			return generator.template({...defaultArgs, blueprint, ...params});
		});
	}

	return blueprint;
}

/**
 * Loads the package file.
 * @param pkgPath
 * @param userArgs
 */
export function loadPackage ({pkgPath, userArgs}: {pkgPath: string, userArgs: UserArgs}): IPackage | null {

	// Grab package
	if (!fileExists(pkgPath)) {
		console.log(red(`[readme] - Could not find the package file "${pkgPath}".`));
		return null;
	}

	const pkg = <IPackage>readJSONFile(pkgPath) || {};

	// Construct the configuration object
	extendPackageWithDefaults({pkg, userArgs});

	return pkg;
}

/**
 * Generates the readme.
 */
export async function generate ({pkg, pkgPath}: {pkg: IPackage, pkgPath: string}) {

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

/**
 * Shows the help information in the console.
 */
export function showHelp () {
	console.log(commandLineUsage(helpContent));
}

/**
 * Runs the readme command.
 * @param userArgs
 */
export function run (userArgs: UserArgs) {
	const pkgPath = resolve(userArgs["package"] || defaultPackageName);
	const pkg = loadPackage({pkgPath, userArgs});
	if (pkg != null) {
		if (pkg.readme.help) {
			showHelp();
		} else {
			generate({pkg, pkgPath}).then();
		}
	}
}