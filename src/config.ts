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
 * Converts a value to a boolean.
 * @param v
 */
function booleanTransformer (v: any): boolean {
	return v !== "false";
}

/**
 * Defaults for each package key.
 */
export const commandArgs: [string, any, ((v: any) => any)?][] = [
	["name", null],
	["contributors", null],
	["license", null],
	["readme.blueprint", defaultConfig.blueprint],
	["readme.output", defaultConfig.output],
	["readme.text", defaultConfig.text],
	["readme.lineBreak", defaultConfig.lineBreak],
	["readme.tab", defaultConfig.tab],
	["readme.placeholder", defaultConfig.placeholder],
	["readme.line", defaultConfig.line],
	["readme.templates", defaultConfig.templates],
	["readme.bullets", defaultConfig.bullets],
	["readme.silent", defaultConfig.silent, booleanTransformer],
	["readme.dry", defaultConfig.dry, booleanTransformer]
];

/**
 * Extracts user inputted values.
 * @param keyPath
 * @param userArgs
 * @param pkg
 * @param defaultValue
 * @param transform
 */
function extractValue<T> ({keyPath, userArgs, pkg, defaultValue, transform}: {keyPath: string, userArgs: CommandArgs, pkg: IPackage, defaultValue: T, transform?: ((v: string | T | null) => T)}): T {
	transform = transform || ((v: T) => v);
	const userValue = transform(getValue(userArgs, keyPath));
	const pkgValue = getValue(pkg, keyPath);
	return <T>(userValue != null ? userValue : (pkgValue != null ? pkgValue : defaultValue));
}

/**
 * Constructs a configuration object.
 * @param pkg
 * @param userArgs
 */
export function extendPackageWithDefaults ({pkg, userArgs}: {pkg: IPackage, userArgs: CommandArgs}) {
	for (const [keyPath, defaultValue, transform] of commandArgs) {
		const value = extractValue({keyPath, defaultValue, pkg, userArgs, transform});
		setValue(pkg, keyPath, value);
	}
}
