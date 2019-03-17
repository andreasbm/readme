import { WcaCliConfig } from "web-component-analyzer";
import { generateBadges, generateContributors, generateDescription, generateDocumentation, generateInterpolate, generateLicense, generateLine, generateLoad, generateLogo, generateMainTitle, generateTitle, generateToc } from "./generate/generators";
import { getValue, loadConfig, setValue } from "./helpers";
import { IConfig, IGenerator, LineColor, Options } from "./model";

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
	checkLinks: false,
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
 * @param options
 * @param config
 */
export function extendConfigWithDefaults ({options, config}: {config: IConfig, options: Options}): IConfig {
	config = {...config};

	for (let [key, value] of Object.entries(defaultConfig)) {
		value = getValue(options, key) || getValue(config, key) || value;
		setValue(config, key, value);
	}

	return config;
}
