import {getValue} from "./helpers";
import path from "path";

export const defaultConfig = {
	lineBreak: "\r\n",
	tab: "\t",
	inputName: "blueprint.md",
	pkgName: "package.json",
	outputName: "README.md",
	placeholder: ["{{", "}}"],
	dry: false,
	silent: false,
	githubBadges: [
		{
			"alt": "Dependencies",
			"url": "https://david-dm.org/{{ readme.ids.github }}",
			"img": "https://img.shields.io/david/{{ readme.ids.github }}.svg"
		},
		{
			"alt": "Contributors",
			"url": "https://github.com/{{ readme.ids.github }}/graphs/contributors",
			"img": "https://img.shields.io/github/contributors/{{ readme.ids.github }}.svg"
		}
	],
	npmBadges: [
		{
			"alt": "Downloads per month",
			"url": "https://npmcharts.com/compare/{{ readme.ids.npm }}?minimal=true",
			"img": "https://img.shields.io/npm/dm/{{ readme.ids.npm }}.svg"
		},
		{
			"alt": "NPM Version",
			"url": "https://www.npmjs.com/package/{{ readme.ids.npm }}",
			"img": "https://img.shields.io/npm/v/{{ readme.ids.npm }}.svg"
		}
	],
	webcomponentBadges: [
		{
			"alt": "Published on webcomponents.org",
			"url": "https://www.webcomponents.org/element/{{ readme.ids.webcomponents }}",
			"img": "https://img.shields.io/badge/webcomponents.org-published-blue.svg"
		}
	]
};

/**
 * Constructs the configuration object.
 * @param pkg
 * @param userArgs
 * @param pkgName
 * @param generators
 * @returns {{inputName: *, outputName: *, silent: (*|boolean), dry: (*|boolean), pkgName: *, placeholder: (*|string[]), generators: *, lineBreak: (*|string), tab: (*|string), templates: *}}
 */
export function constructConfig ({pkg, userArgs, pkgName, generators}) {
	const inputName = path.resolve(userArgs["input"] || getValue(pkg, "readme.input") || defaultConfig.inputName);
	const outputName = path.resolve(userArgs["outputName"] || getValue(pkg, "readme.output") || defaultConfig.outputName);

	const templates = userArgs["templates"] || getValue(pkg, "readme.templates");

	const placeholder = userArgs["placeholder"] || getValue(pkg, "readme.placeholder") || defaultConfig.placeholder;
	const lineBreak = userArgs["lineBreak"] || getValue(pkg, "readme.lineBreak") || defaultConfig.lineBreak;
	const tab = userArgs["tab"] || getValue(pkg, "readme.tab") || defaultConfig.tab;

	const silent = (userArgs["silent"] != null ? userArgs["silent"] : getValue(pkg, "readme.silent")) || defaultConfig.silent;
	const dry = (userArgs["dry"] != null ? userArgs["dry"] : getValue(pkg, "readme.dry")) || defaultConfig.dry;


	return {inputName, outputName, silent, dry, pkgName, placeholder, generators, lineBreak, tab, templates};
}
