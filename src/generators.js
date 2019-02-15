import path from "path";
import {fileExists, isObject, placeholderRegexCallback, readFile} from "./helpers";
import {getBadges, getValue} from "./helpers.js";
import {lineTemplate, titleTemplate} from "./templates";
import {
	badgesTemplate,
	bulletsTemplate,
	contributorsTemplate,
	descriptionTemplate,
	licenseTemplate,
	logoTemplate,
	mainTitleTemplate,
	tocTemplate
} from "./templates.js";

/**
 * Creates a simple template.
 * @param name
 * @param template
 * @param params
 * @returns {{name: *, regex: (function({config: *}): RegExp), template: (function(): *), params: *}}
 */
export function simpleTemplateGenerator ({name, template, params}) {
	return {
		name,
		regex: placeholderRegexCallback(`template:${name}`),
		template: () => template,
		params
	}
}

/**
 * Loads markdown.
 * @type {{name: string, regex: RegExp, template: (function({content: *}): *), params: Function}}
 */
export const generateMarkdown = {
	name: "markdown",
	regex: placeholderRegexCallback("readme:(.*.md)"),
	template: ({content}) => content,
	params: ({pkg, matches}) => {
		const absolutePath = path.resolve(matches[1]);

		// Check if file exists
		if (!fileExists(absolutePath)) {
			return {error: `the file "${absolutePath}" doesn't exist.`};
		}

		// Read the file
		const content = readFile(absolutePath);
		return {content};
	}
};

/**
 * Generates a logo.
 * @type {{name: string, regex: RegExp, template: logoTemplate, params: {logo: string}}}
 */
export const generateLogo = {
	name: "logo",
	regex: placeholderRegexCallback("readme:logo"),
	template: logoTemplate,
	params: {
		logo: "readme.logo"
	}
};

/**
 * Generates a title.
 * @type {{name: string, regex: RegExp, template: mainTitleTemplate, params: {name: string}}}
 */
export const generateMainTitle = {
	name: "main-title",
	regex: placeholderRegexCallback("readme:title"),
	template: mainTitleTemplate,
	params: {
		name: "name"
	}
};

/**
 * Generates badges.
 * @type {{name: string, regex: RegExp, template: badgesTemplate, params: Function}}
 */
export const generateBadges = {
	name: "badges",
	regex: placeholderRegexCallback("readme:badges"),
	template: badgesTemplate,
	params: ({pkg, config}) => {
		const badges = getBadges({pkg, config});
		if (badges.length === 0) return null;
		return {badges};
	}
};

/**
 * Generates a description.
 * @type {{name: string, regex: RegExp, template: descriptionTemplate, params: {description: string, optional: {demo: string, text: string}}}}
 */
export const generateDescription = {
	name: "description",
	regex: placeholderRegexCallback("readme:description"),
	template: descriptionTemplate,
	params: {
		description: "description",
		optional: {
			demo: "readme.demo",
			text: "readme.text"
		}
	}
};

/**
 * Generates bullets.
 * @type {{name: string, regex: RegExp, template: bulletsTemplate, params: {bullets: string}}}
 */
export const generateBullets = {
	name: "bullets",
	regex: placeholderRegexCallback("readme:bullets"),
	template: bulletsTemplate,
	params: {
		bullets: "readme.bullets"
	}
};

/**
 * Generates a line.
 * @type {{name: string, regex: RegExp, template: lineTemplate}}
 */
export const generateLine = {
	name: "line",
	regex: placeholderRegexCallback("readme:line"),
	template: lineTemplate
};

/**
 * Generates contributors.
 * @type {{name: string, regex: RegExp, template: contributorsTemplate, params: {contributors: string}}}
 */
export const generateContributors = {
	name: "contributors",
	regex: placeholderRegexCallback("readme:contributors"),
	template: contributorsTemplate,
	params: {
		contributors: "contributors"
	}
};

/**
 * Generates license.
 * @type {{name: string, regex: RegExp, template: licenseTemplate, params: {license: string}}}
 */
export const generateLicense = {
	name: "license",
	regex: placeholderRegexCallback("readme:license"),
	template: licenseTemplate,
	params: {
		license: "license"
	}
};

/**
 * Generates the titles.
 * @type {{name: string, regex: RegExp, template: titleTemplate, params: (function({pkg: *, input: *, matches: *}): {title: *, level: *})}}
 */
export const generateTitle = {
	name: "title",
	regex: () => /^([#]{1,2}) (.*)$/gm,
	template: titleTemplate,
	params: ({pkg, input, matches}) => {
		const hashes = matches[0];
		const title = matches[1];
		return {title, level: hashes.length};
	}
};

/**
 * Generates the interpolation.
 * @type {{name: string, regex: RegExp, template: (function({pkg?: *, text: *}): *), params: (function({pkg: *, matches: *}): {pkg: *, text: *})}}
 */
export const generateInterpolate = {
	name: "interpolate",
	regex: placeholderRegexCallback(`[^\\s:]*`),
	template: ({pkg, text, config}) => {
		let value = getValue(pkg, text);
		if (value == null) return text;

		// If object, turn it into an array
		if (isObject(value)) {
			value = Object.entries(value).map(([k, v]) => `**${k}**: ${v}`);
		}

		// Turn arrays into bullets if its an array!
		if (Array.isArray(value)) {
			value = bulletsTemplate({bullets: value, config});
		}

		return value;
	},
	params: ({pkg, matches}) => {
		const text = matches[0];
		return {pkg, text: text.trim()};
	}
};

/**
 * Generates the toc.
 * @type {{name: string, regex: RegExp, template: tocTemplate, params: (function({pkg: *, input: *, config: *}): {titles: RegExpMatchArray | Promise<Response | undefined> | *, config: *})}}
 */
export const generateToc = {
	name: "toc",
	regex: placeholderRegexCallback("readme:toc"),
	template: tocTemplate,
	params: ({pkg, input, config}) => {
		const titles = input.match(/^[#]{1,6} .*$/gm);
		return {titles, config};
	}
};
