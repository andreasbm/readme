import {getLicenseUrl, getTitle, getTitleLink} from "./helpers";
import { BadgesTemplateArgs, BulletsTemplateArgs, ContributorsTemplateArgs, DemoTemplateArgs, DescriptionTemplateArgs, LicenseTemplateArgs, LineTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TitleTemplateArgs } from "./model";

/**
 * Creates the template for the logo.
 * @param logo
 */
export function logoTemplate ({logo}: LogoTemplateArgs): string {
	const {url, width = "auto", height = "auto", alt = "Logo"} = logo;
	return `<p align="center">
  <img src="${url}" alt="${alt}" width="${width}" height="${height}" />
</p>`;
}

/**
 * Creates the template for the title.
 * @param name
 */
export function mainTitleTemplate ({name}: MainTitleTemplateArgs): string {
	return `<h1 align="center">${name}</h1>`
}

/**
 * Creates a line template.
 */
export function lineTemplate ({config}: LineTemplateArgs) {
	const {line} = config;
	const url = `https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-${line}.png`;
	return `
![-----------------------------------------------------](${url})`;
}

/**
 * Creates a template for the title.
 * @param title
 * @param level
 * @param config
 */
export function titleTemplate ({title, level, config}: TitleTemplateArgs) {
	const beforeTitleContent = level <= 2 ? `${lineTemplate({config})}${config.lineBreak}${config.lineBreak}` : "";
	return `${beforeTitleContent}${(<any>Array(level)).fill("#").join("")} ${getTitle({title, level})}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param config
 */
export function badgesTemplate ({badges, config}: BadgesTemplateArgs): string {
	return `<p align="center">
		${badges.map(badge => `<a href="${badge.url}"><img alt="${badge.alt}" src="${badge.img}" height="20"/></a>`).join(config.lineBreak)}
	</p>
`;
}

/**
 * Creates a template for the license.
 * @param license
 * @returns {string}
 */
export function licenseTemplate ({license}: LicenseTemplateArgs) {
	return `## License
	
Licensed under [${license}](${getLicenseUrl(license)}).`;
}

/**
 * Creates a template for the demo link.
 * @param url
 */
export function demoTemplate ({url}: DemoTemplateArgs) {
	return `Go here to see a demo <a href="${url}">${url}</a>.`;
}

/**
 * Creates a description template.
 * @param description
 * @param text
 * @param demo
 */
export function descriptionTemplate ({description, text, demo}: DescriptionTemplateArgs): string {
	return `<p align="center">
  <b>${description}</b></br>
  <sub>${text != null ? text : ""}${demo != null ? ` ${demoTemplate({url: demo})}` : ""}<sub>
</p>

<br />
`;
}

/**
 * Creates a bullets template.
 * @param bullets
 * @param config
 */
export function bulletsTemplate ({bullets, config}: BulletsTemplateArgs): string {
	return bullets.map(bullet => `* ${bullet}`).join(config.lineBreak);
}

/**
 * Creates the table of contents.
 * @param titles
 * @param config
 */
export function tocTemplate ({titles, config}: TableOfContentsTemplateArgs): string {

	// Figure out the lowest level
	const titleLevels = titles.map(title => {return {title, level: (title.match(/#/g) || []).length}});
	const lowestLevel = titleLevels.reduce((acc, {title, level}) => Math.min(acc, level), Infinity);

	// Format the table of contents title because it is applied after the title template
	return `${titleTemplate({title: "Table of Contents", level: 2, config})}

${titleLevels.map(({title, level}) => {
		// Subtract the lowest level from the level to ensure that the lowest level will have 0 tabs in front
		// We can't make any assumptions about what level of headings the readme uses.
		const tabs = (<any>Array(level - lowestLevel)).fill(config.tab).join("");
		const cleanedTitle = title.replace(/^[# ]*/gm, "");
		return `${tabs}* [${cleanedTitle}](${getTitleLink(cleanedTitle)})`;
	}).join(config.lineBreak)}`;
}

/**
 * Creates the authors template.
 * @param authors
 */
export function contributorsTemplate ({contributors, config}: ContributorsTemplateArgs): string {
	return `## Contributors
	
${contributors.map(({name, email, url}) => `* <a href="${url}">${name}</a> ${email != null ? `(<a href="mailto:${email}">${email}</a>` : ""})`).join(config.lineBreak)}`;
}

