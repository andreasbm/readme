import colors from "colors";
import fse from "fs-extra";
import path from "path";
import {config} from "./config";

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
 * @param obj
 * @param fileName
 * @returns {boolean}
 */
export function validateObject ({obj, requiredFields}) {
	for (const key of requiredFields) {
		if (!hasKey(obj, key)) {
			return false;
		}
	}

	return true;
}

/**
 * Replaces the placeholders with content from the obj.
 * @param text
 * @param obj
 * @returns {*}
 */
export function interpolate (text, obj) {
	return text.replace(config.VALUE_INTERPOLATION_REGEX, (string, match) => {
		return getValue(obj, match.trim());
	});
}

/**
 * Returns whether the func is a function.
 * @param func
 * @returns {boolean}
 */
export function isFunction (func) {
	return typeof func === "function";
}

/**
 * Extracts values from an object.
 * @param map
 * @param obj
 */
export function extractValues ({map, obj}) {
	const newObj = {};
	for (const [k, v] of Object.entries(map)) {
		newObj[k] = getValue(obj, v);
	}

	return newObj;
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
		badges.push(...config.NPM_BADGES);
	}

	// Add Github badges
	if (hasKey(pkg, "readme.ids.github")) {
		badges.push(...config.GITHUB_BADGES);
	}

	// Add webcomponents badges
	if (hasKey(pkg, "readme.ids.webcomponents")) {
		badges.push(...config.WEBCOMPONENTS_BADGES);
	}

	return badges
}

/**
 * Reads a file.
 * @param name
 * @returns {string}
 */
export function readFile (name) {
	return fse.readFileSync(path.resolve(name)).toString("utf8");
}

/**
 * Reads the contents of a json file.
 * @param name
 * @returns {any}
 */
export function readJSONFile (name) {
	return JSON.parse(readFile(name));
}

/**
 * Returns a placeholder regex.
 * @param text
 * @returns {RegExp}
 */
export function placeholderRegex (text = ".+?") {
	return new RegExp(`{{[ ]*(${text})[ ]*}}`, "g");
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

/**
 * Determines whether the file at the path exists.
 * @param absolutePath
 * @returns {boolean}
 */
export function fileExists (absolutePath) {
	return fse.existsSync(absolutePath)
}

/**
 * Generates a readme.
 * @param pkg
 * @param input
 * @param generators
 * @param silent
 * @param pkgName
 * @param inputName
 * @returns {*}
 */
export function generateReadme ({pkg, input, generators, silent, pkgName, inputName}) {

	// Go through all of the generators and replace with the template
	for (const generator of generators) {
		input = input.replace(generator.regex, (string, ...matches) => {
			let params = null;

			// If the params are required we extract them from the package.
			if (generator.params != null) {
				let errorReason;
				if (isFunction(generator.params)) {

					// Extract the params using the function
					params = generator.params({
						pkg,
						input,
						string,
						matches,
						generators,
						generateReadme,
						pkgName,
						inputName
					});

					// Validate the params
					if (params == null || params.error) {
						errorReason = (params || {}).error || `the params couldn't not be generated`;
					}

				} else {

					// Get the required and optional parameters
					const optionalParams = generator.params["optional"] || [];
					const requiredParams = {...generator.params};
					delete requiredParams["optional"];

					// Validate the params
					if (!validateObject({obj: pkg, requiredFields: Object.values(requiredParams)})) {
						errorReason = `"${pkgName}" is missing the keys "${Object.values(requiredParams).join(", ")}"`;
					} else {
						params = extractValues({map: {...optionalParams, ...requiredParams}, obj: pkg});
					}
				}

				// If an error occurred print it and continue
				if (errorReason != null) {
					if (!silent) {
						console.log(colors.yellow(`The readme generator "${generator.name}" matched "${string}" but was skipped because ${errorReason}.`));
					}

					return string;
				}
			}

			return generator.template(params);
		})
	}

	return input;
}