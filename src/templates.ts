import { clean } from "semver";
import { getCleanTitle, getLicenseUrl, getTitle, getTitleLink, isValidURL, splitArrayIntoArrays } from "./helpers";
import { BadgesTemplateArgs, BulletsTemplateArgs, ContributorsTemplateArgs, DemoTemplateArgs, DescriptionTemplateArgs, IConfig, LicenseTemplateArgs, LineColor, LineTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TableTemplateArgs, TitleTemplateArgs } from "./model";

/**
 * Creates the template for the logo.
 * @param logo
 */
export function logoTemplate ({logo}: LogoTemplateArgs): string {
	const {src, width = "auto", height = "auto", alt = "Logo"} = logo;
	return `<p align="center">
  <img src="${src}" alt="${alt}" width="${width}" height="${height}" />
</p>`;
}

/**
 * Creates the template for the title.
 * @param name
 */
export function mainTitleTemplate ({name}: MainTitleTemplateArgs): string {
	return `<h1 align="center">${name}</h1>`;
}

/**
 * Creates a line template.
 * @param config
 */
export function lineTemplate ({config}: LineTemplateArgs) {
	let url = "";
	const {line} = config;

	// If the line should not be there we just return an empty string.
	if (line === LineColor.NONE) {
		return ``;
	}

	// Construct the URL.
	if (isValidURL(line)) {
		url = line;
	} else {
		url = `https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/${line}.png`;
	}

	return `![-----------------------------------------------------](${url})`;
}

/**
 * Creates a template for the title.
 * @param title
 * @param level
 * @param config
 */
export function titleTemplate ({title, level, config}: TitleTemplateArgs) {
	const beforeTitleContent = level <= 2 ? `${config.lineBreak}[${lineTemplate({config})}](${getTitleLink(title)})${config.lineBreak}${config.lineBreak}` : "";
	return `${beforeTitleContent}${(<any>Array(level)).fill("#").join("")} ${getTitle({title, level, config})}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param config
 */
export function badgesTemplate ({badges, config}: BadgesTemplateArgs): string {
	return `<p align="center">
		${badges.map(badge => `<a href="${badge.url}"><img alt="${badge.alt}" src="${badge.img}" height="20"/></a>`)
	            .join(config.lineBreak)}
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
 * @param pkg
 */
export function bulletsTemplate ({bullets, config}: BulletsTemplateArgs): string {
	return bullets.map(bullet => `* ${bullet}`).join(config.lineBreak);
}

/**
 * Creates a table template.
 * @param content
 * @param config
 */
export function tableTemplate ({content, config}: TableTemplateArgs): string {
	const tableSplitter = `|`;

	// Add the | ------------- | ---- | ----- | ----- | line after the header
	if (content.length > 1) {
		content.splice(1, 0, Array(content[0].length).fill("-------"));
	}

	return content.map((row, i) => {

		// If the table splitter symbol is used within the table we need to make it safe
		row = row.map(r => r.replace(tableSplitter, "\\$&"));

		return `${tableSplitter} ${row.join(` ${tableSplitter} `)} ${tableSplitter}`;
	}).join(config.lineBreak);
}

/**
 * Creates the table of contents.
 * @param titles
 * @param pkg
 */
export function tocTemplate ({titles, config}: TableOfContentsTemplateArgs): string {

	// Create a clean titles array.
	// We are going to use it to figure out the index of each title (there might be more titles with the same name).
	const tempCleanTitles = titles.map(title => getCleanTitle(title));

	// Create a map, mapping each clean title to the amount of times it occurs in the titles array
	const countForTitle: {[key: string]: number} = <any>tempCleanTitles.reduce((acc: {[key: string]: number}, title) => { acc[title] = (acc[title] || 0) + 1; return acc; }, {});

	// Map the titles to relevant info.
	const titlesInfo = titles.map(title => {
		const cleanTitle = getCleanTitle(title);
		const titlesWithSameName = tempCleanTitles.filter(t => t === cleanTitle);

		// Remove title from the temp array and compute the index
		tempCleanTitles.splice(tempCleanTitles.indexOf(cleanTitle), 1);

		// Compute the index (the first will be 0 and so on)
		const index = ((countForTitle[cleanTitle] || 1) - titlesWithSameName.length);

		// Compute the level of the title
		const level = (title.match(/#/g) || []).length;

		// Compute the title link
		const titleLink = getTitleLink(title, index);

		return {title, cleanTitle, index, titleLink, level};
	});

	// Find the lowest level of heading (# is lower than ##)
	const lowestLevel = titlesInfo.reduce((acc, {title, level}) => Math.min(acc, level), Infinity);

	// Format the table of contents title because it is applied after the title template
	return `${titleTemplate({title: "Table of Contents", level: 2, config: config})}

${titlesInfo.map(({level, titleLink, title}) => {
		// Subtract the lowest level from the level to ensure that the lowest level will have 0 tabs in front
		// We can't make any assumptions about what level of headings the readme uses.
		const tabs = (<any>Array(level - lowestLevel)).fill(config.tab).join("");
		title = title.replace(/^#*\s*/, "").trim();
		return `${tabs}* [${title}](${titleLink})`;
	}).join(config.lineBreak)}`;
}

/**
 * Creates the authors template.
 * @param contributors
 * @param config
 */
export function contributorsTemplate ({contributors, config}: ContributorsTemplateArgs): string {
	const {contributorsPerRow} = config;
	const imageSize = 100;

	// Split the contributors into multiple arrays (one for each row)
	const rows = splitArrayIntoArrays(contributors, contributorsPerRow);

	return `## Contributors
	
${rows.map(row => {

		// Figures out what elements the row should have
		const hasImages = row.find(({img}) => img != null);
		const hasEmails = row.find(({email}) => email != null);

		// Create the cells for the images for each contributor in the row
		const imgCells = row.map(({img, url, name}) => img != null ? `[<img alt="${name}" src="${img}" width="${imageSize}">](${url})` : "")
		                    .join(" | ");

		// Create the cells that tells markdown that this is a table
		const tableCells = Array(row.length).fill(":---:").join(" | ");

		// Create a cell for each name
		const nameCells = row.map(({url, email, name}) => `[${name}](${url})`).join(" | ");

		// Create a cell for each email address
		const emailCells = row.map(({url, email}) => email != null ? `[${email}](mailto:${email})` : "").join(" | ");

		// Find the maximum amount of info lines for the row!
		const maxInfoLinesCount = row.reduce((acc, {info}) => info != null ? Math.max(acc, info.length) : acc, 0);

		// For each line we go through the row and find the correct info
		const infoLines = Array(maxInfoLinesCount).fill(0).map((_, i) => {
			const infoForLine = row.map(({info}) => info != null && i < info.length ? info[i] : "");
			return `${infoForLine.join(" | ")}`;
		});

		// Join each line in the row
		return `|${[
			...(hasImages ? [imgCells] : []),
			tableCells,
			nameCells,
			...(hasEmails ? [emailCells] : []),
			...infoLines
		].join(`|${config.lineBreak}|`)}|`;
	}).join(config.lineBreak)}`;
}

/**
 * Creates a svg line template.
 * Currently base64 inline svg is not supported by Github flavored markdown.
 * @param pkg
 */
export function svgLineTemplate ({config}: {config: IConfig}): string {
	const lineColors = [
		"#63BC47",
		"#FBB724",
		"#F58220",
		"#E03A3E",
		"#963F97",
		"#0B9EDA"
	];

	const width = 900;
	const height = 9;
	const lineHeight = 2;
	const lineParthWidth = Math.round(width / lineColors.length);

	const svg = `
<svg width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="line-colored" fill-rule="nonzero">
            <g id="line">
                <rect id="bg" x="0" y="0" width="${width}" height="${height}"></rect>
                <g id="parts" transform="translate(0, ${height - lineHeight})">
                    ${lineColors.map((color,
	                                  i) => `<rect fill="${color}" x="${lineParthWidth * i}" y="0" width="${lineParthWidth}" height="${lineHeight}"></rect>`)
	                            .join(config.lineBreak)}
                </g>
            </g>
        </g>
    </g>
</svg>`;

	return svg;
}
