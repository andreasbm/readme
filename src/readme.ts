import { green, red, yellow } from "colors";
import checkLinks from "check-links";
import { resolve } from "path";
import { defaultConfig, defaultConfigName, defaultDocumentationConfig, defaultGenerators, extendConfigWithDefaults, extendConfigWithExtendConfig } from "./config";
import { simpleTemplateGenerator } from "./generators";
import { extractValues, fileExists, isFunction, loadConfig, loadPackage, readFile, replaceInString, setValue, validateObject, writeFile } from "./helpers";
import { IConfig, IGenerator, IGeneratorParamsArgs, IGeneratorParamsError, Params, Options } from "./model";
import * as program from "commander";
import pkg from "./../package.json";

/**
 * Generates a readme.
 * @param pkg
 * @param blueprint
 * @param configPath
 * @param generators
 */
export async function generateReadme ({config, blueprint, configPath, generators}: {config: IConfig, blueprint: string, configPath: string, generators: IGenerator<any>[]}): Promise<string> {

	const {silent} = config;

	// Go through all of the generators and replace with the template
	let defaultArgs = {config, configPath, generateReadme};

	for (const generator of generators) {
		const regex = generator.regex({...defaultArgs, blueprint});
		let match: RegExpMatchArray | null = null;

		do {
			match = regex.exec(blueprint);
			if (match != null) {
				let markdown = match[0];
				let errorReason;
				let params: any | null | Params | IGeneratorParamsError = null;

				// If the params are required we extract them from the package.
				if (generator.params != null) {
					if (isFunction(generator.params)) {

						// Extract the params using the function
						params = (<(args: IGeneratorParamsArgs) => any>generator.params)({
							...defaultArgs,
							blueprint,
							match
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
						if (!validateObject({obj: config, requiredFields: (<any>Object).values(requiredParams)})) {
							errorReason = `"${configPath}" is missing one or more of the keys "${(<any>Object).values(requiredParams)
							                                                                                  .join(", ")}"`;
						} else {
							params = extractValues({map: {...optionalParams, ...requiredParams}, obj: config});
						}
					}
				}

				// Use the template if no errors occurred
				if (errorReason == null) {
					markdown = await generator.template({...defaultArgs, blueprint, ...params});

				} else {
					if (!silent) {
						console.log(yellow(`[readme] - The readme generator "${generator.name}" matched "${match[0]}" but was skipped because ${errorReason}.`));
					}
				}

				// Replace the match with the new markdown
				const start = match.index!;
				const end = start + match[0].length;
				blueprint = replaceInString(blueprint, markdown, {start, end});

				// Change the regex pointer so we dont parse the newly added content again
				regex.lastIndex = start + markdown.length;
			}
		} while (match != null);
	}

	return blueprint;
}

/**
 * Generates the readme.
 */
export async function generate ({config, configPath, generators}: {config: IConfig, configPath: string, generators: IGenerator<any>[]}) {

	const {dry, silent, templates, output} = config;

	// Grab blueprint
	let blueprint: string = "";
	if (Array.isArray(config.input)) {
		blueprint = config.input.join(config.lineBreak);

	} else {
		const blueprintPath = resolve(config.input);
		if (!fileExists(blueprintPath)) {
			console.log(red(`[readme] - Could not find the blueprint file "${blueprintPath}". Make sure to provide a valid path as either the user arguments --readme.input or in the "input" field in the "${configPath}" file.`));
			return;
		}

		blueprint = readFile(blueprintPath) || "";
	}

	// Grab templates
	if (templates != null) {
		const simpleTemplateGenerators = templates.map(simpleTemplateGenerator);

		// Append the simple generators after the loading generator
		generators.splice(1, 0, ...simpleTemplateGenerators);
	}

	// Generate the readme
	const readme = await generateReadme({config, blueprint, configPath, generators});

	// Check broken links
	if (config.checkBrokenLinks) {

		// Find all links
		const links = Array.from(readme.match(/(http|www)[A-Za-z\d-\._~:\/?#\[\]@!\$&\+;=]+/gm) || []);
		console.log(green(`[readme] - Found "${links.length}" links. Checking all of them now!`));

		// Check all links
		const results = await checkLinks(links);

		// Go through the results and notify the user about broken links
		for (const [link, {status, statusCode}] of Object.entries(results)) {
			if (status === "dead") {
				console.log(red(`[readme] - The link "${link}" is dead. Responded with status code "${statusCode}".`));
			}
		}
	}

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
 * Runs the readme command.
 * @param options
 */
export async function generateCommand (options: Options) {
	const configPath = resolve(options["config"] || options["c"] || defaultConfigName);

	let config: IConfig = loadConfig(configPath) || defaultConfig;
	config = extendConfigWithExtendConfig({config});
	config = extendConfigWithDefaults({config, options});

	// Extend the config with the package object
	config.pkg = {...(loadPackage(config.package) || {}), ...config.pkg};
	await generate({config, configPath, generators: defaultGenerators});
}

/**
 * Runs the cli.
 * @param args
 */
export async function run (args: string[]) {
	program
		.version(pkg.version);

	program
		.command("generate")
		.description(`Generates a README file.`)
		.option(`--c --config <string>`, `Path of the configuration file. Defaults to '${defaultConfigName}'.`, defaultConfigName)
		.option(`--p --package <string>`, `Path of the package file. Defaults to '${defaultConfig.package}'.`, defaultConfig.package)
		.option(`--o, --output <string>`, `Path of the generated README file. Defaults to '${defaultConfig.output}'.`, defaultConfig.output)
		.option(`--i, --input <string>`, `The blueprint. Defaults to '${defaultConfig.input}'.`, defaultConfig.input)
		.option(`-d, --dry`, `Whether the command should run as dry. If dry, the output file is not generated but outputted to the console instead.`, defaultConfig.dry)
		.option(`--badges <list>`, `Badges. Used for the 'badges' template.`)
		.option(`--text <string>`, `Text describing your project. Used for the 'description' template.`)
		.option(`--demo <string>`, `Demo url for your project. Used for the 'description' template.`)
		.option(`--lineBreak <string>`, `The linebreak used in the generation of the README file. Defaults to '\\r\\n'`, defaultConfig.lineBreak)
		.option(`--tab <string>`, `The tab used in the generation of the README file. Defaults to '\\t'`, defaultConfig.tab)
		.option(`--placeholder <list>`, `The placeholder syntax used when looking for templates in the blueprint. Defaults to '\["\{\{", "\}\}"\]`, defaultConfig.placeholder)
		.option(`--line <string>`, `The line style of the titles. Can also be an URL. Defaults to 'colored'.`, defaultConfig.line)
		.option(`--templates <list>`, `User created templates.`, defaultConfig.templates)
		.option(`--silent`, `Whether the console output from the command should be silent.`, defaultConfig.silent)
		.option(`--headingPrefix <object>`, `The prefix of the header tags. Defaults to '\{1: "➤ ", 2: "➤ "\}'`, defaultConfig.headingPrefix)
		.option(`--logo <object>`, `The logo information. Used for the 'logo' template.`)
		.option(`--contributorsPerRow <integer>`, `The amount of contributors pr row when using the 'contributors' template. Defaults to '${defaultConfig.contributorsPerRow}'`, defaultConfig.contributorsPerRow)
		.option(`--documentationConfig <object>`, `Configuration object for automatic documentation template.`, defaultDocumentationConfig)
		.option(`--extend <string>`, `Path to another configuration object that should be extended.`)
		.option(`--checkBrokenLinks`, `Checks all links for aliveness after the README file has been generated.`)
		.option(`--pkg.name <string>`, `Contributors of the project. Used for the 'contributors' template.`)
		.option(`--pkg.contributors <list>`, `Contributors of the project. Used for the 'contributors' template.`)
		.option(`--pkg.license <license>`, `License kind. Used for the 'license' template.`)
		.action( ()  => {
			const options = program.opts();
			generateCommand(options).then();
		});

	// Error on unknown commands
	program.on("command:*", () => {
		console.error("Invalid command: See --help for a list of available commands.");
		process.exit(1);
	});

	// Parse the input
	program.parse(args);
}