import fse from "fs-extra";
import path from "path";
import {CONFIG} from "./config.js";
import {getBadges, getValue, interpolate} from "./helpers.js";
import {
	badgesTemplate,
	bulletsTemplate,
	descriptionTemplate,
	licenseTemplate,
	logoTemplate,
	readmeTitleTemplate,
	sectionTemplate,
	tocTemplate,
	contributorsTemplate
} from "./templates.js";

/**
 * Generates the logo.
 * @param pkg
 * @returns {*}
 */
export function generateLogo (pkg) {
	const logo = getValue(pkg, "readme.logo");
	if (logo == null) {
		return null;
	}

	return logoTemplate(logo);
}

/**
 * Generates the title.
 * @param pkg
 * @returns {*}
 */
export function generateTitle (pkg) {
	const name = getValue(pkg, "name");
	if (name == null) {
		return null;
	}

	return readmeTitleTemplate(name);
}

/**
 * Generates the badges.
 * @param pkg
 * @returns {*}
 */
export function generateBadges (pkg) {
	const badges = getBadges(pkg);
	if (badges.length === 0) {
		return null;
	}

	return badgesTemplate({badges, pkg});
}

/**
 * Generates the description.
 * @param pkg
 * @returns {*}
 */
export function generateDescription (pkg) {
	const description = getValue(pkg, "description");
	const demo = getValue(pkg, "readme.demo");
	const text = getValue(pkg, "readme.text");

	if (description == null && demo === null && text == null) {
		return null;
	}

	return descriptionTemplate({description, text, demo});
}

/**
 * Generates the bullets.
 * @param pkg
 * @returns {*}
 */
export function generateBullets (pkg) {
	const bullets = getValue(pkg, "readme.bullets") || [];
	if (bullets.length === 0) {
		return null;
	}

	return bulletsTemplate(bullets);
}

/**
 * Generates the table of contents.
 * @param pkg
 * @returns {string}
 */
export function generateTableOfContents (pkg) {
	const toc = getValue(pkg, "readme.toc");
	const titles = (getValue(pkg, "readme.sections") || [])
		.map(({title}) => title)
		.filter(title => title != null)
		.map(title => interpolate(title, pkg));

	if (!toc || titles.length === 0) {
		return null;
	}

	return tocTemplate({titles});
}

/**
 * Generates the sections.
 * @param pkg
 * @returns {string}
 */
export function generateSections (pkg) {
	const sections = (getValue(pkg, "readme.sections") || []).map(({content, title}) => {
		const absolutePath = path.resolve(content);
		if (fse.existsSync(absolutePath)) {
			content = fse.readFileSync(absolutePath).toString("utf8");
		}
		return {content: interpolate(content, pkg), title: interpolate(title || "", pkg)};
	});

	return sections.map(sectionTemplate).join(`${CONFIG.LINE_BREAK}${CONFIG.LINE_BREAK}`);
}

/**
 * Generates the license.
 * @param pkg
 * @returns {*}
 */
export function generateLicense (pkg) {
	const license = getValue(pkg, "license");
	if (license == null) {
		return null;
	}

	return licenseTemplate(license);
}

/**
 * Generates the authors.
 * @param pkg
 * @returns {null}
 */
export function generateContributors (pkg) {
	const contributors = getValue(pkg, "contributors");
	if (contributors == null) {
		return null;
	}

	return contributorsTemplate({contributors});
}
