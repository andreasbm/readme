import * as program from "commander";
import pkg from "./../package.json";
import { checkLinksCommand } from "./check-links/check-links";
import { defaultConfig, defaultConfigName, defaultDocumentationConfig } from "./config";
import { generateCommand } from "./generate/generate";

/**
 * Runs the cli.
 * @param argv
 */
export async function run (argv: string[]) {
	program
		.version(pkg.version);

	program
		.command(`check-links`)
		.description(`Checks all links for aliveness.`)
		.option(`--i, --input <string>`, `Path of the file that needs to be checked. Defaults to '${defaultConfig.output}'`, defaultConfig.output)
		.action( cmd  => {
			checkLinksCommand(cmd.opts()).then();
		});

	program
		.command(`generate`)
		.description(`Generates a README file.`)
		.option(`-c --config <path>`, `Path of the configuration file. Defaults to '${defaultConfigName}'.`)
		.option(`-p --package <path>`, `Path of the package file. Defaults to '${defaultConfig.package}'.`)
		.option(`-o --output <path>`, `Path of the generated README file. Defaults to '${defaultConfig.output}'.`)
		.option(`-i --input <path>`, `Path of the blueprint. Defaults to '${defaultConfig.input}'.`)
		.option(`-e --extend <path>`, `Path to another configuration object that should be extended.`)
		.option(`-d --dry`, `Whether the command should run as dry. If dry, the output file is not generated but outputted to the console instead.`)
		.option(`--badges <list>`, `Badges. Used for the 'badges' template.`)
		.option(`--text <string>`, `Text describing your project. Used for the 'description' template.`)
		.option(`--demo <string>`, `Demo url for your project. Used for the 'description' template.`)
		.option(`--lineBreak <string>`, `The linebreak used in the generation of the README file. Defaults to '\\r\\n'`)
		.option(`--tab <string>`, `The tab used in the generation of the README file. Defaults to '\\t'`)
		.option(`--placeholder <list>`, `The placeholder syntax used when looking for templates in the blueprint. Defaults to '\["\{\{", "\}\}"\]`)
		.option(`--line <string>`, `The line style of the titles. Can also be an URL. Defaults to 'colored'.`)
		.option(`--templates <list>`, `User created templates.`)
		.option(`--silent`, `Whether the console output from the command should be silent.`)
		.option(`--headingPrefix <object>`, `The prefix of the header tags. Defaults to '\{1: "➤ ", 2: "➤ "\}'`)
		.option(`--logo <object>`, `The logo information. Used for the 'logo' template.`)
		.option(`--contributorsPerRow <integer>`, `The amount of contributors pr row when using the 'contributors' template. Defaults to '${defaultConfig.contributorsPerRow}'`)
		.option(`--documentationConfig <object>`, `Configuration object for automatic documentation template.`)
		.option(`--checkLinks`, `Checks all links for aliveness after the README file has been generated.`)
		.option(`--pkg.name <string>`, `Contributors of the project. Used for the 'contributors' template.`)
		.option(`--pkg.contributors <list>`, `Contributors of the project. Used for the 'contributors' template.`)
		.option(`--pkg.license <license>`, `License kind. Used for the 'license' template.`)
		.action( cmd  => {
			generateCommand(cmd.opts()).then();
		});

	// Do some error handling
	const userArgs = argv.slice(2);
	if (userArgs.length === 0) {
		program.help();
	}

	// Handle unknown commands
	program.on("command:*", () => {
		console.error(`Invalid command: ${userArgs.join(" ")}\nSee --help for a list of available commands.`);
		process.exit(1);
	});

	// Parse the input
	program.parse(argv);
}
