import { resolve } from "path";
import { fileExists, getBadges, getValue, isObject, placeholderRegexCallback, readFile } from "./helpers";
import { BadgesTemplateArgs, BulletsTemplateArgs, ContributorsTemplateArgs, DescriptionTemplateArgs, IConfig, IGenerator, IGeneratorParamsArgs, IUserTemplate, LicenseTemplateArgs, LineTemplateArgs, LoadTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, Package, TableOfContentsTemplateArgs, TitleTemplateArgs } from "./model";
import { badgesTemplate, bulletsTemplate, contributorsTemplate, descriptionTemplate, licenseTemplate, lineTemplate, logoTemplate, mainTitleTemplate, titleTemplate, tocTemplate } from "./templates";

/**
 * Creates a simple template.
 * @param name
 * @param template
 * @param params
 */
export function simpleTemplateGenerator ({name, template, params}: IUserTemplate): IGenerator<{}> {
	return {
		name,
		regex: placeholderRegexCallback(`template:${name}`),
		template: () => template,
		params
	};
}

/**
 * Loads markdown.
 */
export const generateLoad: IGenerator<LoadTemplateArgs> = {
	name: "load",
	regex: placeholderRegexCallback("load:(.*.md)"),
	template: ({content, generateReadme, config, pkg}: LoadTemplateArgs) => {
		// Recursively generate the readme for all the files that are being loaded, but only add the load generator
		// since all of the generators should only run once.
		return generateReadme({pkg, input: content, config: {...config, generators: [generateLoad]}});
	},
	params: ({pkg, matches, generateReadme, config}) => {
		const absolutePath = resolve(matches[1]);

		// Check if file exists
		if (!fileExists(absolutePath)) {
			return {error: `the file "${absolutePath}" doesn't exist.`};
		}

		// Read the file
		const content = readFile(absolutePath);
		return {content, generateReadme, config, pkg};
	}
};

/**
 * Generates a logo.
 */
export const generateLogo: IGenerator<LogoTemplateArgs> = {
	name: "logo",
	regex: placeholderRegexCallback("template:logo"),
	template: logoTemplate,
	params: {
		logo: "readme.logo"
	}
};

/**
 * Generates a title.
 */
export const generateMainTitle: IGenerator<MainTitleTemplateArgs> = {
	name: "main-title",
	regex: placeholderRegexCallback("template:title"),
	template: mainTitleTemplate,
	params: {
		name: "name"
	}
};

/**
 * Generates badges.
 */
export const generateBadges: IGenerator<BadgesTemplateArgs> = {
	name: "badges",
	regex: placeholderRegexCallback("template:badges"),
	template: badgesTemplate,
	params: ({pkg, config}: IGeneratorParamsArgs) => {
		const badges = getBadges({pkg, config});
		if (badges.length === 0) return null;
		return {badges, config};
	}
};

/**
 * Generates a description.
 */
export const generateDescription: IGenerator<DescriptionTemplateArgs> = {
	name: "description",
	regex: placeholderRegexCallback("template:description"),
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
 */
export const generateBullets: IGenerator<BulletsTemplateArgs> = {
	name: "bullets",
	regex: placeholderRegexCallback("template:bullets"),
	template: bulletsTemplate,
	params: {
		bullets: "readme.bullets"
	}
};

/**
 * Generates a line.
 */
export const generateLine: IGenerator<LineTemplateArgs> = {
	name: "line",
	regex: placeholderRegexCallback("template:line"),
	template: lineTemplate
};

/**
 * Generates contributors.
 */
export const generateContributors: IGenerator<ContributorsTemplateArgs> = {
	name: "contributors",
	regex: placeholderRegexCallback("template:contributors"),
	template: contributorsTemplate,
	params: {
		contributors: "contributors"
	}
};

/**
 * Generates license.
 */
export const generateLicense: IGenerator<LicenseTemplateArgs> = {
	name: "license",
	regex: placeholderRegexCallback("template:license"),
	template: licenseTemplate,
	params: {
		license: "license"
	}
};

/**
 * Generates the titles.
 */
export const generateTitle: IGenerator<TitleTemplateArgs> = {
	name: "title",
	regex: () => /^([#]{1,2}) (.*)$/gm,
	template: titleTemplate,
	params: ({pkg, input, matches, config}) => {
		const hashes = matches[0];
		const title = matches[1];
		return {title, level: hashes.length, config};
	}
};

/**
 * Generates the interpolation.
 */
export const generateInterpolate: IGenerator<{pkg: Package, text: string, config: IConfig}> = {
	name: "interpolate",
	regex: placeholderRegexCallback(`[^\\s:]*`),
	template: ({pkg, text, config}) => {
		let value = getValue<string>(pkg, text);
		if (value == null) return text;

		// If object, turn it into an array
		if (isObject(value)) {
			value = (<any>Object).entries(value).map(([k, v]) => `**${k}**: ${v}`);
		}

		// Turn arrays into bullets if its an array!
		if (Array.isArray(value)) {
			value = bulletsTemplate({bullets: value, config});
		}

		return value;
	},
	params: ({pkg, matches, config}) => {
		const text = matches[0];
		return {pkg, text: text.trim(), config};
	}
};

/**
 * Generates the toc.
 * @type {{name: string, regex: RegExp, template: tocTemplate, params: (function({pkg: *, input: *, config: *}): {titles: RegExpMatchArray | Promise<Response | undefined> | *, config: *})}}
 */
export const generateToc: IGenerator<TableOfContentsTemplateArgs> = {
	name: "toc",
	regex: placeholderRegexCallback("template:toc"),
	template: tocTemplate,
	params: ({pkg, input, config}) => {
		const titles = input.match(/^[#]{1,6} .*$/gm);
		return {titles, config};
	}
};
