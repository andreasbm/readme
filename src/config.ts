import { OptionDefinition, OptionList } from "command-line-usage";
import { WcaCliConfig } from "web-component-analyzer";
import { generateBadges, generateContributors, generateDescription, generateDocumentation, generateInterpolate, generateLicense, generateLine, generateLoad, generateLogo, generateMainTitle, generateTitle, generateToc } from "./generators";
import { getValue, loadConfig, setValue } from "./helpers";
import { IConfig, IGenerator, LineColor, UserArgs } from "./model";

export const defaultGenerators: IGenerator<any>[] = [
	// Pre process
	generateLoad,

	// Process
	generateLogo,
	generateMainTitle,
	generateBadges,
	generateDescription,
	generateLine,
	generateContributors,
	generateLicense,
	generateDocumentation,

	// Post process
	generateTitle,
	generateInterpolate,
	generateToc
];

export const defaultDocumentationConfig: WcaCliConfig = {format: "md", debug: false, markdown: {titleLevel: 2}};

/**
 * Default name of the blueprint configuration.
 */
export const defaultConfigName = `blueprint.json`;

/**
 * Default configuration.
 */
export const defaultConfig: IConfig = {
	lineBreak: "\r\n",
	tab: "\t",
	input: "blueprint.md",
	package: "package.json",
	output: "README.md",
	checkBrokenLinks: false,
	placeholder: ["{{", "}}"],
	dry: false,
	silent: false,
	help: false,
	line: LineColor.COLORED,
	templates: [],
	contributorsPerRow: 6,
	headingPrefix: {
		1: "➤ ",
		2: "➤ "
	},
	pkg: {},
	documentationConfig: defaultDocumentationConfig
};

/**
 * Available options for the command.
 */
export const commandOptions: OptionDefinition[] = [
	{
		name: "config",
		alias: "c",
		description: `Path of the configuration file. Defaults to '${defaultConfigName}'.`,
		type: String
	},
	{
		name: "package",
		alias: "p",
		description: `Path of the package file. Defaults to '${defaultConfig.package}'.`,
		defaultValue: defaultConfig.package,
		type: String
	},
	{
		name: "pkg.name",
		description: `Name of the project. Used for the 'title' template.`,
		type: String
	},
	{
		name: "pkg.contributors",
		description: `Contributors of the project. Used for the 'contributors' template.`,
		type: {name: "\\{name: string; email?: string; url?: string; img?: string; info?: string[];\\}[]"}
	},
	{
		name: "pkg.license",
		description: `License kind. Used for the 'license' template.`,
		type: String
	},
	{
		name: "output",
		alias: "o",
		description: `Path of the generated README file. Defaults to '${defaultConfig.output}'.`,
		defaultValue: defaultConfig.output,
		type: String
	},
	{
		name: "help",
		alias: "h",
		description: "Display this help message.",
		defaultValue: defaultConfig.help
	},
	{
		name: "input",
		alias: "i",
		description: `The blueprint. Defaults to '${defaultConfig.input}'.`,
		defaultValue: defaultConfig.input,
		type: String
	},
	{
		name: "badges",
		description: `Badges. Used for the 'badges' template.`,
		type: {name: "\\{alt: string; url: string; img: string;\\}[]"}
	},
	{
		name: "text",
		description: `Text describing your project. Used for the 'description' template.`,
		type: String
	},
	{
		name: "demo",
		description: `Demo url for your project. Used for the 'description' template.`,
		type: String
	},
	{
		name: "lineBreak",
		description: `The linebreak used in the generation of the README file. Defaults to 'rn'`,
		defaultValue: defaultConfig.lineBreak,
		type: String
	},
	{
		name: "tab",
		description: `The tab used in the generation of the README file. Defaults to 't'`,
		defaultValue: defaultConfig.tab,
		type: String
	},
	{
		name: "placeholder",
		description: `The placeholder syntax used when looking for templates in the blueprint. Defaults to '\\["\\{\\{", "\\}\\}"\\]`,
		defaultValue: defaultConfig.placeholder,
		type: {name: "\\[string, string\\]"}
	},
	{
		name: "line",
		description: `The line style of the titles. Can also be an URL. Defaults to 'colored'.`,
		defaultValue: defaultConfig.line,
		type: String
	},
	{
		name: "templates",
		description: `User created templates.`,
		defaultValue: defaultConfig.templates,
		type: {name: "\\{name: string; template: string;\\}[]"}
	},
	{
		name: "silent",
		alias: "s",
		description: `Whether the console output from the command should be silent.`,
		defaultValue: defaultConfig.silent,
		type: Boolean
	},
	{
		name: "dry",
		alias: "d",
		description: `Whether the command should run as dry. If dry, the output file is not generated but outputted to the console instead..`,
		defaultValue: defaultConfig.dry,
		type: Boolean
	},
	{
		name: "headingPrefix",
		description: `The prefix of the header tags. Defaults to '\\{1: "➤ ", 2: "➤ "\\}'`,
		defaultValue: defaultConfig.headingPrefix,
		type: {name: "\\{\\[key: number\\]\\: string\\}"}
	},
	{
		name: "logo",
		description: "The logo information. Used for the 'logo' template.",
		type: {name: "\\{src: string; alt?: string; width?: number; height?: number;\\}"}
	},
	{
		name: "contributorsPerRow",
		description: `The amount of contributors pr row when using the 'contributors' template. Defaults to '${defaultConfig.contributorsPerRow}'`,
		defaultValue: defaultConfig.contributorsPerRow,
		type: Number
	},
	{
		name: "documentationConfig",
		description: `Configuration object for automatic documentation template.`,
		defaultValue: defaultDocumentationConfig,
		type: Object
	},
	{
		name: "extend",
		description: `Path to another configuration object that should be extended.`,
		type: String
	},
	{
		name: "checkBrokenLinks",
		description: `Checks all links whether they are broken after the README file has been generated.`,
		type: Boolean
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
 * Constructs a config using the extend path if one is defined.
 * @param config
 */
export function extendConfigWithExtendConfig ({config}: {config: IConfig}): IConfig {

	// Recursively load the extend path.
	const extend = config.extend;
	if (extend != null) {
		const extendConfig = loadConfig(extend);

		// Make sure the config exists
		if (extendConfig == null) {
			throw new Error(`Could not load extend config at path "${extend}". Make sure the file exists.`);
		}

		// Merge the extend with the config. The config object takes precedence.
		config = {...extendConfigWithExtendConfig({config: extendConfig}), ...config};
	}

	return config;
}

/**
 * Constructs a configuration object with defaults.
 * @param pkg
 * @param userArgs
 */
export function extendConfigWithDefaults ({userArgs, config}: {config: IConfig, userArgs: UserArgs}): IConfig {
	config = {...config};

	for (const {name, alias, defaultValue, type} of commandOptions) {

		// Grab the user provided value
		const userValue = getValue(userArgs, name) || (alias != null ? getValue(userArgs, alias!) : null);

		// Grab the config provided value
		const configValue = getValue(config, name);

		// Transform the value
		const value = userValue != null ? transformValue({type, value: userValue}) : configValue || defaultValue;
		if (value != null) {
			setValue(config, name, value);
		}
	}

	return config;
}
