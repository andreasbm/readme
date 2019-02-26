import { getLicenseUrl, getTitle, getTitleLink, isValidURL, splitArrayIntoArrays } from "./helpers";
import { BadgesTemplateArgs, BulletsTemplateArgs, ContributorsTemplateArgs, DemoTemplateArgs, DescriptionTemplateArgs, IPackage, LicenseTemplateArgs, LineColor, LineTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TableTemplateArgs, TitleTemplateArgs } from "./model";

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
 */
export function lineTemplate ({pkg}: LineTemplateArgs) {
	let url = "";
	const {line} = pkg.readme;

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
 * @param pkg
 */
export function titleTemplate ({title, level, pkg}: TitleTemplateArgs) {
	const beforeTitleContent = level <= 2 ? `
[${lineTemplate({pkg})}${pkg.readme.lineBreak}${pkg.readme.lineBreak}](${getTitleLink(title)})` : "";
	return `${beforeTitleContent}${(<any>Array(level)).fill("#").join("")} ${getTitle({title, level, pkg})}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param pkg
 */
export function badgesTemplate ({badges, pkg}: BadgesTemplateArgs): string {
	return `<p align="center">
		${badges.map(badge => `<a href="${badge.url}"><img alt="${badge.alt}" src="${badge.img}" height="20"/></a>`)
	            .join(pkg.readme.lineBreak)}
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
export function bulletsTemplate ({bullets, pkg}: BulletsTemplateArgs): string {
	return bullets.map(bullet => `* ${bullet}`).join(pkg.readme.lineBreak);
}

/**
 * Creates a table template.
 * @param content
 * @param pkg
 */
export function tableTemplate ({content, pkg}: TableTemplateArgs): string {
	const tableSplitter = `|`;

	// Add the | ------------- | ---- | ----- | ----- | line after the header
	if (content.length > 1) {
		content.splice(1, 0, Array(content[0].length).fill("-------"));
	}

	return content.map((row, i) => {

		// If the table splitter symbol is used within the table we need to make it safe
		row = row.map(r => r.replace(tableSplitter, "\\$&"));

		return `${tableSplitter} ${row.join(` ${tableSplitter} `)} ${tableSplitter}`;
	}).join(pkg.readme.lineBreak);
}

/**
 * Creates the table of contents.
 * @param titles
 * @param pkg
 */
export function tocTemplate ({titles, pkg}: TableOfContentsTemplateArgs): string {

	// Map the title to the level of the title (# = 1, ## = 2 and so on)
	const titleLevels = titles.map(title => {
		return {title, level: (title.match(/#/g) || []).length};
	});

	// Find the lowest level of heading (# is lower than ##)
	const lowestLevel = titleLevels.reduce((acc, {title, level}) => Math.min(acc, level), Infinity);

	// Format the table of contents title because it is applied after the title template
	return `${titleTemplate({title: "Table of Contents", level: 2, pkg})}

${titleLevels.map(({title, level}) => {
		// Subtract the lowest level from the level to ensure that the lowest level will have 0 tabs in front
		// We can't make any assumptions about what level of headings the readme uses.
		const tabs = (<any>Array(level - lowestLevel)).fill(pkg.readme.tab).join("");
		const cleanedTitle = title.replace(/^[# ]*/gm, "");
		return `${tabs}* [${cleanedTitle}](${getTitleLink(cleanedTitle)})`;
	}).join(pkg.readme.lineBreak)}`;
}

/**
 * Creates the authors template.
 * @param contributors
 * @param pkg
 */
export function contributorsTemplate ({contributors, pkg}: ContributorsTemplateArgs): string {
	const contributorsPrRow = pkg.readme.contributorsPerRow;
	const imageSize = 100;

	// Split the contributors into multiple arrays (one for each row)
	const rows = splitArrayIntoArrays(contributors, contributorsPrRow);

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
		].join(`|${pkg.readme.lineBreak}|`)}|`;
	}).join(pkg.readme.lineBreak)}`;
}

/**
 * Creates a svg line template.
 * Currently base64 inline svg is not supported by Github flavored markdown.
 * @param pkg
 */
export function svgLineTemplate ({pkg}: {pkg: IPackage}): string {
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
	                            .join(pkg.readme.lineBreak)}
                </g>
            </g>
        </g>
    </g>
</svg>`;

	return svg;
}
