import { resolve } from "path";
import { fileExists, getBadges, getValue, isObject, placeholderRegexCallback, readFile } from "./helpers";
import { BadgesTemplateArgs, ContributorsTemplateArgs, DescriptionTemplateArgs, IGenerator, IGeneratorParamsArgs, IPackage, IUserTemplate, LicenseTemplateArgs, LineTemplateArgs, LoadTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TitleTemplateArgs } from "./model";
import { badgesTemplate, bulletsTemplate, contributorsTemplate, descriptionTemplate, licenseTemplate, lineTemplate, logoTemplate, mainTitleTemplate, tableTemplate, titleTemplate, tocTemplate } from "./templates";

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
	regex: placeholderRegexCallback("load:(.+?\.md)"),
	template: ({content, generateReadme, pkgPath, pkg}: LoadTemplateArgs) => {
		// Recursively generate the readme for all the files that are being loaded, but only add the load generator
		// since all of the generators should only run once.
		return generateReadme({pkg, blueprint: content, pkgPath, generators: [generateLoad]});
	},
	params: ({pkg, matches, generateReadme, pkgPath}) => {
		const absolutePath = resolve(matches[1]);

		// Check if file exists
		if (!fileExists(absolutePath)) {
			return {error: `the file "${absolutePath}" doesn't exist.`};
		}

		// Read the file
		const content = readFile(absolutePath);
		return {content, generateReadme, pkgPath, pkg};
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
	params: ({pkg}: IGeneratorParamsArgs) => {
		const badges = getBadges({pkg});
		if (badges.length === 0) {
			return {error: "it could not generate any badges"};
		}
		return {badges, pkg};
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
	params: ({pkg, matches}) => {
		const hashes = matches[0];
		const title = matches[1];
		return {title, level: hashes.length, pkg};
	}
};

/**
 * Generates the interpolation.
 */
export const generateInterpolate: IGenerator<{pkg: IPackage, text: string}> = {
	name: "interpolate",
	regex: placeholderRegexCallback(`[^\\s:]*`),
	template: ({pkg, text}) => {
		let value = getValue<string>(pkg, text);
		if (value == null) return text;

		// Transform objects into array so they can be transformed into lists
		if (isObject(value)) {
			value = (<any>Object).entries(value).map(([k, v]: [string, string]) => `**${k}**: ${v}`);
		}

		// Transform arrays
		if (Array.isArray(value)) {

			// Turn 2D arrays into tables
			if (value.length > 0 && Array.isArray(value[0])) {
				value = tableTemplate({content: value, pkg});
			}

			// Turn 1D arrays into bullets
			else {
				value = bulletsTemplate({bullets: value, pkg});
			}

		}

		return value || text;
	},
	params: ({pkg, matches}) => {
		const text = matches[0];
		return {pkg, text: text.trim()};
	}
};

/**
 * Generates the toc.
 */
export const generateToc: IGenerator<TableOfContentsTemplateArgs> = {
	name: "toc",
	regex: placeholderRegexCallback("template:toc"),
	template: tocTemplate,
	params: ({pkg, blueprint}) => {
		const titles = blueprint.match(/^[#]{1,6} .*$/gm);
		if (titles == null) {
			return {error: "it could not find any titles"};
		}
		return {titles, pkg};
	}
};

