import fse from "fs-extra";
import path from "path";
import {CONFIG} from "./config";

/**
 * Determines whether an object has the specified key.
 * @param obj
 * @param key
 * @returns {boolean}
 */
export function hasKey (obj, key) {
	return getValue(obj, key) != null;
}

/**
 * Returns the license url.
 * @param license
 * @returns {string}
 */
export function getLicenseUrl (license) {
	return `https://opensource.org/licenses/${license}`;
}

/**
 * Returns a key from an object.
 * @param obj
 * @param key
 * @returns {*}
 */
export function getValue (obj, key) {
	let keys = key.split(".");
	while (keys.length > 0 && obj != null) {
		key = keys.shift();
		obj = obj[key];
	}

	return obj;
}

/**
 * Validates the package.
 * @param pkg
 * @param requiredFields
 * @param fileName
 * @returns {boolean}
 */
export function validateObject (pkg, requiredFields, fileName) {
	for (const key of requiredFields) {
		if (!hasKey(pkg, key)) {
			throw new Error(`"${fileName}" requires the field "${key}".`);
		}
	}

	return true;
}

/**
 * Replaces the placeholders with content from the package.
 * @param text
 * @param pkg
 * @returns {*}
 */
export function interpolate (text, pkg) {
	return text.replace(/{{[ ]*(.+?)[ ]*}}/g, (string, match) => {
		return getValue(pkg, match.trim());
	})
}

/**
 * Returns available badges.
 * @param pkg
 * @returns {Array}
 */
export function getBadges (pkg) {
	const badges = getValue(pkg, "readme.badges") || [];

	// Add NPM badges
	if (hasKey(pkg, "readme.ids.npm")) {
		badges.push(...CONFIG.NPM_BADGES);
	}

	// Add Github badges
	if (hasKey(pkg, "readme.ids.github")) {
		badges.push(...CONFIG.GITHUB_BADGES);
	}

	// Add webcomponents badges
	if (hasKey(pkg, "readme.ids.webcomponents")) {
		badges.push(...CONFIG.WEBCOMPONENTS_BADGES);
	}

	return badges
}

/**
 * Reads the contents of a json file.
 * @param name
 * @returns {any}
 */
export function readJSONFile (name) {
	// Read the content from the package.json file
	const pkgContent = fse.readFileSync(path.resolve(name)).toString("utf8");

	// Parse the package and validate it
	return JSON.parse(pkgContent);
}

/**
 * Generates a readme.
 * @param pkg
 * @param pkgName
 * @param generators
 * @returns {*}
 */
export function generateReadme ({pkg, pkgName, generators}) {
	// Generate the readme string
	return generators.map(generator => generator(pkg))
		.filter(res => res != null)
		.join(`${CONFIG.LINE_BREAK}${CONFIG.LINE_BREAK}`);
}


/**
 * Writes a file to a path.
 * @param target
 * @param content
 */
export function writeFile ({target, content}) {
	const stream = fse.createWriteStream(target);
	stream.write(content);
	stream.end();
}

/**
 * Returns the title for a level.
 * @param title
 * @param level
 * @returns {string}
 */
export function getTitle ({title, level}) {
	return `${level <= 2 ? `❯ ` : ""}${title}`;
}

/**
 * Cleans the title from weird symbols.
 * @param title
 */
export function cleanTitle(title) {
	return title.replace(/[^a-zA-Z0-9-_ ]/g, "");
}

/**
 * Returns the title link.
 * @param title
 * @returns {string}
 */
export function getTitleLink (title) {
	return `#${cleanTitle(title).replace(/ /g, "-").toLowerCase()}`;
}
