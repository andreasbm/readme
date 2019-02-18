import { generateBadges, generateBullets, generateContributors, generateDescription, generateInterpolate, generateLicense, generateLine, generateLoad, generateLogo, generateMainTitle, generateTitle, generateToc } from "./generators";
import { getValue, setValue } from "./helpers";
import { CommandArgs, IConfig, IGenerator, IPackage, LineColor } from "./model";

export const defaultGenerators: IGenerator<any>[] = [
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
	line: LineColor.COLORED,
	templates: []
};

/**
 * Defaults for each package key.
 */
export const commandArgs: [string, any][] = [
	["name", null],
	["contributors", null],
	["license", null],
	["readme.blueprint", defaultConfig.blueprint],
	["readme.output", defaultConfig.output],
	["readme.text", defaultConfig.text],
	["readme.lineBreak", defaultConfig.lineBreak],
	["readme.tab", defaultConfig.tab],
	["readme.silent", defaultConfig.silent],
	["readme.dry", defaultConfig.dry],
	["readme.placeholder", defaultConfig.placeholder],
	["readme.line", defaultConfig.line],
	["readme.templates", defaultConfig.templates],
	["readme.bullets", defaultConfig.bullets]
];

/**
 * Extracts user inputted values.
 * @param key
 * @param userArgs
 * @param pkg
 * @param defaultValue
 */
function extractValue<T> ({keyPath, userArgs, pkg, defaultValue}: {keyPath: string, userArgs: CommandArgs, pkg: IPackage, defaultValue: T}): T {
	return <T>(userArgs[keyPath] != null ? userArgs[keyPath] : getValue(pkg, keyPath)) || defaultValue;
}

/**
 * Constructs a configuration object.
 * @param pkg
 * @param userArgs
 */
export function extendPackageWithDefaults ({pkg, userArgs}: {pkg: IPackage, userArgs: CommandArgs}) {
	for (const [keyPath, defaultValue] of commandArgs) {
		const value = extractValue({keyPath, defaultValue, pkg, userArgs});
		setValue(pkg, keyPath, value);
	}
}
