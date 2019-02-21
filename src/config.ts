import { OptionDefinition, OptionList } from "command-line-usage";
import { generateBadges, generateContributors, generateDescription, generateInterpolate, generateLicense, generateLine, generateLoad, generateLogo, generateMainTitle, generateTitle, generateToc } from "./generators";
import { getValue, setValue } from "./helpers";
import { IConfig, IGenerator, IPackage, LineColor, UserArgs } from "./model";

export const defaultGenerators: IGenerator<any>[] = [
	generateLoad,
	generateLogo,
	generateMainTitle,
	generateBadges,
	generateDescription,
	generateLine,
	generateContributors,
	generateLicense,
	generateTitle,
	generateInterpolate,
	generateToc
];

/**
 * The amount of contributors pr row.
 * TODO: Make it customizable.
 */
export const contributorsPerRow = 10;

/**
 * The maximum document width in px.
 */
export const documentMaxWidth = 900;

/**
 * Default name of the package config.
 */
export const defaultPackageName = "package.json";

/**
 * Default configuration.
 */
export const defaultConfig: IConfig = {
	lineBreak: "\r\n",
	tab: "\t",
	blueprint: "blueprint.md",
	output: "README.md",
	placeholder: ["{{", "}}"],
	dry: false,
	silent: false,
	help: false,
	line: LineColor.COLORED,
	templates: [],
	headingPrefix: {
		1: "➤ ",
		2: "➤ "
	}
};

/**
 * Available options for the command.
 */
export const commandOptions: OptionDefinition[] = [
	{
		name: "package",
		alias: "p",
		description: `Path of the 'package.json' file. Defaults to '${defaultPackageName}'.`,
		defaultValue: defaultPackageName,
		type: String
	},
	{
		name: "name",
		description: `Name of the project. Used for the 'title' template.`,
		type: String
	},
	{
		name: "contributors",
		description: `Contributors of the project. Used for the 'contributors' template.`,
		type: {name: "\\{name: string; email: string; url: string; img: string;\\}[]"}
	},
	{
		name: "license",
		description: `License kind. Used for the 'license' template.`,
		type: String
	},
	{
		name: "readme.output",
		alias: "o",
		description: `Path of the generated README file. Defaults to '${defaultConfig.output}'.`,
		defaultValue: defaultConfig.output,
		type: String
	},
	{
		name: "readme.help",
		alias: "h",
		description: "Display this help message.",
		defaultValue: defaultConfig.help
	},
	{
		name: "readme.blueprint",
		alias: "b",
		description: `The blueprint. Defaults to '${defaultConfig.blueprint}'.`,
		defaultValue: defaultConfig.blueprint,
		type: String
	},
	{
		name: "readme.badges",
		description: `Badges. Used for the 'badges' template.`,
		type: {name: "\\{alt: string; url: string; img: string;\\}[]"}
	},
	{
		name: "readme.text",
		description: `Text describing your project. Used for the 'description' template.`,
		type: String
	},
	{
		name: "readme.demo",
		description: `Demo url for your project. Used for the 'description' template.`,
		type: String
	},
	{
		name: "readme.lineBreak",
		description: `The linebreak used in the generation of the README file. Defaults to 'rn'`,
		defaultValue: defaultConfig.lineBreak,
		type: String
	},
	{
		name: "readme.tab",
		description: `The tab used in the generation of the README file. Defaults to 't'`,
		defaultValue: defaultConfig.tab,
		type: String
	},
	{
		name: "readme.placeholder",
		description: `The placeholder syntax used when looking for templates in the blueprint. Defaults to '\\["\\{\\{", "\\}\\}"\\]`,
		defaultValue: defaultConfig.placeholder,
		type: {name: "\\[string, string\\]"}
	},
	{
		name: "readme.line",
		description: `The line style of the titles. Can also be an URL. Defaults to 'colored'.`,
		defaultValue: defaultConfig.line,
		type: String
	},
	{
		name: "readme.templates",
		description: `User created templates.`,
		defaultValue: defaultConfig.templates,
		type: {name: "\\{name: string; template: string;\\}[]"}
	},
	{
		name: "readme.silent",
		alias: "s",
		description: `Whether the console output from the command should be silent.`,
		defaultValue: defaultConfig.silent,
		type: Boolean
	},
	{
		name: "readme.dry",
		alias: "d",
		description: `Whether the command should run as dry. If dry, the output file is not generated but outputted to the console instead..`,
		defaultValue: defaultConfig.dry,
		type: Boolean
	},
	{
		name: "readme.headingPrefix",
		description: `The prefix of the header tags. Defaults to '\\{1: "➤ ", 2: "➤ "\\}'`,
		defaultValue: defaultConfig.headingPrefix,
		type: {name: "\\{\\[key: number\\]\\: string\\}"}
	},
	{
		name: "logo",
		description: "The logo information. Used for the 'logo' template.",
		type: {name: "\\{url: string; alt?: string; width?: number; height?: number;\\}"}
	}
];


export const helpContent: OptionList = {
	header: "Options",
	optionList: commandOptions
};


/**
 * Converts a value to a boolean.
 * @param v
 */
function booleanTransformer (v: any): boolean {
	return v !== "false";
}

/**
 * Transforms the value based on the type.
 * @param type
 * @param value
 */
function transformValue ({type, value}: {type: any, value: any}): any {
	if (value == null) {
		return null;
	}

	if (type === Boolean) {
		return booleanTransformer(value);
	}

	return value;
}

/**
 * Constructs a configuration object.
 * @param pkg
 * @param userArgs
 */
export function extendPackageWithDefaults ({pkg, userArgs}: {pkg: IPackage, userArgs: UserArgs}) {
	for (const {name, alias, defaultValue, type} of commandOptions) {

		// Grab the user provided value
		const userValue = getValue(userArgs, name) || (alias != null ? getValue(userArgs, alias!) : null);

		// Grab the package provided value
		const pkgValue = getValue(pkg, name);

		// Transform the value
		const value = transformValue({type, value: userValue}) || pkgValue || defaultValue;
		setValue(pkg, name, value);
	}
}
