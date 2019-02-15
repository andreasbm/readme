import {CONFIG} from "./config";
import {cleanTitle, getLicenseUrl, getTitle, getTitleLink, interpolate} from "./helpers.js";

export function logoTemplate ({url, width = "auto", height = "auto", alt = "Logo"}) {
	return `<p align="center">
  <img src="${url}" alt="${alt}" width="${width}" height="${height}" />
</p>`;
}

/**
 * Creates the template for the title.
 * @param title
 * @returns {string}
 */
export function readmeTitleTemplate (title) {
	return `<h1 align="center">${title}</h1>`
}

/**
 * Creates a line template.
 * @returns {string}
 */
export function lineTemplate () {
	return `![split](https://github.com/andreasbm/readme/assets/raw/master/split.png)`;
}

/**
 * Creates a template for the title.
 * @param title
 * @param level
 * @returns {string}
 */
export function titleTemplate ({title, level}) {
	const beforeTitleContent = level <= 2 ? `${lineTemplate()}${CONFIG.LINE_BREAK}${CONFIG.LINE_BREAK}` : "";
	return `${beforeTitleContent}${Array(level).fill("#").join("")} ${getTitle({title, level})}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param pkg
 * @returns {string}
 */
export function badgesTemplate ({badges, pkg}) {
	return `<p align="center">
		${badges.map(badge => interpolate(`<a href="${badge.url}"><img alt="${badge.text}" src="${badge.img}" height="20"/></a>`, pkg)).join(CONFIG.LINE_BREAK)}
	</p>`;
}

/**
 * Creates a template for the license.
 * @param license
 * @returns {string}
 */
export function licenseTemplate (license) {
	return `${titleTemplate({title: "License", level: 2})}
	
Licensed under [${license}](${getLicenseUrl(license)}).`;
}

/**
 * Creates a template for the demo link.
 * @param url
 * @returns {string}
 */
export function demoTemplate (url) {
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
  <sub>${text != null ? text : ""}${demo != null ? ` ${demoTemplate(demo)}` : ""}<sub>
</p>

<br />`;
}

/**
 * Creates a bullets template.
 * @param bullets
 */
export function bulletsTemplate (bullets) {
	return bullets.map(bullet => `* ${bullet}`).join(CONFIG.LINE_BREAK);
}

/**
 * Creates a section template.
 * @param section
 */
export function sectionTemplate ({title, content}) {
	return `${title != null && title.length > 0 ? `${titleTemplate({
		title,
		level: 2
	})}${CONFIG.LINE_BREAK}${CONFIG.LINE_BREAK}` : ""}${content}`;
}

/**
 * Creates the table of contents.
 * @param sections
 * @returns {string}
 */
export function tocTemplate ({titles}) {
	return `${titleTemplate({title: "Table of Contents", level: 2})}

${titles.map(title => `* [${cleanTitle(title)}](${getTitleLink(getTitle({title, level: 2}))})`).join(CONFIG.LINE_BREAK)}`
}

/**
 * Creates the authors template.
 * @param authors
 * @returns {string}
 */
export function contributorsTemplate ({contributors}) {
	/**
	 | <img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   />                   |
	 | --------------------------------------------------------------------------------------------------------------------------------- |
	 | [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br>[@FredWessberg](https://twitter.com/FredWessberg)<br>_Lead Developer_ |
	 */
	return `${titleTemplate({title: "Contributors", level: 2})}
	...`;
}

