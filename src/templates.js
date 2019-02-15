import {getLicenseUrl, getTitle, getTitleLink} from "./helpers.js";

export function logoTemplate ({logo}) {
	const {url, width = "auto", height = "auto", alt = "Logo"} = logo;
	return `<p align="center">
  <img src="${url}" alt="${alt}" width="${width}" height="${height}" />
</p>`;
}

/**
 * Creates the template for the title.
 * @param name
 * @returns {string}
 */
export function mainTitleTemplate ({name}) {
	return `<h1 align="center">${name}</h1>`
}

/**
 * Creates a line template.
 * @returns {string}
 */
export function lineTemplate () {
	return `![line](https://github.com/andreasbm/readme/blob/master/assets/line.png)`;
}

/**
 * Creates a template for the title.
 * @param title
 * @param level
 * @param config
 * @returns {string}
 */
export function titleTemplate ({title, level, config}) {
	const beforeTitleContent = level <= 2 ? `${lineTemplate()}${config.lineBreak}${config.lineBreak}` : "";
	return `${beforeTitleContent}${Array(level).fill("#").join("")} ${getTitle({title, level})}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param config
 * @returns {string}
 */
export function badgesTemplate ({badges, config}) {
	return `<p align="center">
		${badges.map(badge => `<a href="${badge.url}"><img alt="${badge.text}" src="${badge.img}" height="20"/></a>`).join(config.lineBreak)}
	</p>`;
}

/**
 * Creates a template for the license.
 * @param license
 * @returns {string}
 */
export function licenseTemplate ({license}) {
	return `## License
	
Licensed under [${license}](${getLicenseUrl(license)}).`;
}

/**
 * Creates a template for the demo link.
 * @param url
 * @returns {string}
 */
export function demoTemplate ({url}) {
	return `Go here to see a demo <a href="${url}">${url}</a>.`;
}

/**
 * Creates a description template.
 * @param description
 * @param text
 * @param demo
 * @returns {string}
 */
export function descriptionTemplate ({description, text, demo}) {
	return `<p align="center">
  <b>${description}</b></br>
  <sub>${text != null ? text : ""}${demo != null ? ` ${demoTemplate({url: demo})}` : ""}<sub>
</p>

<br />`;
}

/**
 * Creates a bullets template.
 * @param bullets
 * @param config
 * @returns {string | *}
 */
export function bulletsTemplate ({bullets, config}) {
	return bullets.map(bullet => `* ${bullet}`).join(config.lineBreak);
}

/**
 * Creates the table of contents.
 * @param titles
 * @param config
 * @returns {string}
 */
export function tocTemplate ({titles, config}) {
	return `## Table of Contents

${titles.map(title => {
		const tabs = Array(Math.max((title.match(/#/g) || []).length - 2, 0)).fill(config.tab).join("");
		const cleanedTitle = title.replace(/^[# ]*/gm, "");
		return `${tabs}* [${cleanedTitle}](${getTitleLink(cleanedTitle)})`;
	}).join(config.lineBreak)}`

}

/**
 * Creates the authors template.
 * @param authors
 * @returns {string}
 */
export function contributorsTemplate ({contributors, config}) {
	return `## Contributors
	
${contributors.map(({name, email, url}) => `* <a href="${url}">${name}</a> ${email != null ? `(<a href="mailto:${email}">${email}</a>` : ""})`).join(config.lineBreak)}`;
}

