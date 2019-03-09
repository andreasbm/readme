import { resolve } from "path";
import { fileExists, getBadges, getValue, isObject, placeholderRegexCallback, readFile } from "./helpers";
import { BadgesTemplateArgs, ContributorsTemplateArgs, DescriptionTemplateArgs, IGenerator, IGeneratorParamsArgs, IConfig, IUserTemplate, LicenseTemplateArgs, LineTemplateArgs, LoadTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TitleTemplateArgs, DocumentationTemplateArgs } from "./model";
import { badgesTemplate, bulletsTemplate, contributorsTemplate, descriptionTemplate, documentationTemplate, licenseTemplate, lineTemplate, logoTemplate, mainTitleTemplate, tableTemplate, titleTemplate, tocTemplate } from "./templates";

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
	template: ({content, generateReadme, configPath, config}: LoadTemplateArgs) => {
		// Recursively generate the readme for all the files that are being loaded, but only add the load generator
		// since all of the generators should only run once.
		return generateReadme({config, blueprint: content, configPath, generators: [generateLoad]});
	},
	params: ({config, matches, generateReadme, configPath}) => {
		const absolutePath = resolve(matches[1]);

		// Check if file exists
		if (!fileExists(absolutePath)) {
			return {error: `the file "${absolutePath}" doesn't exist.`};
		}

		// Read the file
		const content = readFile(absolutePath) || "";
		return {content, generateReadme, configPath, config};
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
		logo: "logo",
		src: "logo.src"
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
		name: "pkg.name"
	}
};

/**
 * Generates badges.
 */
export const generateBadges: IGenerator<BadgesTemplateArgs> = {
	name: "badges",
	regex: placeholderRegexCallback("template:badges"),
	template: badgesTemplate,
	params: ({config}: IGeneratorParamsArgs) => {
		const badges = getBadges({config});
		if (badges.length === 0) {
			return {error: "it could not generate any badges"};
		}
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
		description: "pkg.description",
		optional: {
			demo: "demo",
			text: "text"
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
		contributors: "pkg.contributors"
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
		license: "pkg.license"
	}
};

/**
 * Generates the titles.
 */
export const generateTitle: IGenerator<TitleTemplateArgs> = {
	name: "title",
	regex: () => /^([#]{1,2}) (.*)$/gm,
	template: titleTemplate,
	params: ({config, matches}) => {
		const hashes = matches[0];
		const title = matches[1];
		return {title, level: hashes.length, config};
	}
};

/**
 * Generates the interpolation.
 */
export const generateInterpolate: IGenerator<{config: IConfig, text: string}> = {
	name: "interpolate",
	regex: placeholderRegexCallback(`[^\\s:]*`),
	template: ({config, text}) => {
		let value = getValue<string>(config, text);
		if (value == null) return text;

		// Transform objects into array so they can be transformed into lists
		if (isObject(value)) {
			value = (<any>Object).entries(value).map(([k, v]: [string, string]) => `**${k}**: ${v}`);
		}

		// Transform arrays
		if (Array.isArray(value)) {

			// Turn 2D arrays into tables
			if (value.length > 0 && Array.isArray(value[0])) {
				value = tableTemplate({content: value, config: config});
			}

			// Turn 1D arrays into bullets
			else {
				value = bulletsTemplate({bullets: value, config: config});
			}

		}

		return value || text;
	},
	params: ({config, matches}) => {
		const text = matches[0];
		return {config, text: text.trim()};
	}
};

/**
 * Generates the toc.
 */
export const generateToc: IGenerator<TableOfContentsTemplateArgs> = {
	name: "toc",
	regex: placeholderRegexCallback("template:toc"),
	template: tocTemplate,
	params: ({config, blueprint}) => {
		const titles = blueprint.match(/^[#]{1,6} .*$/gm);
		if (titles == null) {
			return {error: "it could not find any titles"};
		}
		return {titles, config};
	}
};

/**
 * Generates documentation.
 */
export const generateDocumentation: IGenerator<DocumentationTemplateArgs> = {
	name: "documentation",
	regex: placeholderRegexCallback("doc:(.+?)"),
	template: documentationTemplate,
	params: ({matches}: IGeneratorParamsArgs) => {
		const glob = matches[1];
		if (glob.length === 0) {
			return {error: "it could not find the glob"};
		}
		return {glob};
	}
};
