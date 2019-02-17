import { resolve } from "path";
import { getValue } from "./helpers";
import { IConfig, IUserTemplate, LineColor, PlaceholderSyntax } from "./model";

/**
 * Default configuration.
 */
export const defaultConfig: IConfig = {
	lineBreak: "\r\n",
	tab: "\t",
	inputName: "blueprint.md",
	pkgName: "package.json",
	outputName: "README.md",
	placeholder: ["{{", "}}"],
	dry: false,
	silent: false,
	line: LineColor.COLORED,
	generators: [],
	templates: []
};

/**
 * Constructs a configuration object.
 * @param pkg
 * @param userArgs
 * @param pkgName
 * @param generators
 */
export function constructConfig ({pkg, userArgs, pkgName, generators}): IConfig {
	const inputName: string = resolve(userArgs["input"] || getValue(pkg, "readme.input") || defaultConfig.inputName);
	const outputName: string = resolve(userArgs["output"] || getValue(pkg, "readme.output") || defaultConfig.outputName);

	const templates: IUserTemplate[] = userArgs["templates"] || getValue(pkg, "readme.templates") || [];

	const line: LineColor = userArgs["line"] || getValue(pkg, "readme.line") || defaultConfig.line;
	const placeholder: PlaceholderSyntax = userArgs["placeholder"] || getValue(pkg, "readme.placeholder") || defaultConfig.placeholder;
	const lineBreak: string = userArgs["lineBreak"] || getValue(pkg, "readme.lineBreak") || defaultConfig.lineBreak;
	const tab: string = userArgs["tab"] || getValue(pkg, "readme.tab") || defaultConfig.tab;

	const silent: boolean = (userArgs["silent"] != null ? userArgs["silent"] : getValue(pkg, "readme.silent")) || defaultConfig.silent;
	const dry: boolean = (userArgs["dry"] != null ? userArgs["dry"] : getValue(pkg, "readme.dry")) || defaultConfig.dry;

	return {
		inputName,
		outputName,
		silent,
		dry,
		pkgName,
		placeholder,
		generators,
		lineBreak,
		tab,
		templates,
		line
	};
}
