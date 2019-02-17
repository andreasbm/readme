import colors from "colors";
import fse from "fs-extra";
import path from "path";
import {githubBadges, npmBadges, webcomponentsBadges} from "./badges";
import {defaultConfig} from "./config";

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
 * Returns whether the func is a function.
 * @param func
 * @returns {boolean}
 */
export function isFunction (func) {
	return typeof func === "function";
}

/**
 * Returns whether the obj is an object.
 * @param obj
 * @returns {boolean}
 */
export function isObject (obj) {
	if (obj == null) {
		return false;
	}

	return typeof obj === "object" && !Array.isArray(obj);
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
 * @param config
 * @returns {*|Array}
 */
export function getBadges ({pkg, config}) {
	const badges = [...(getValue(pkg, "readme.badges") || [])];

	const npmId = getValue(pkg, "readme.ids.npm");
	const githubId = getValue(pkg, "readme.ids.github");
	const webcomponentsId = getValue(pkg, "readme.ids.webcomponents");

	// Add NPM badges
	if (npmId != null) {
		badges.push(...npmBadges({npmId}));
	}

	// Add Github badges
	if (githubId != null) {
		badges.push(...githubBadges({githubId}));
	}

	// Add webcomponents badges
	if (webcomponentsId != null) {
		badges.push(...webcomponentsBadges({webcomponentsId}));
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
 * Escapes a regex.
 * @param text
 * @returns {void | string | *}
 */
export function escapeRegex (text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Returns a placeholder regex.
 * @param text
 * @returns {function({config: *}): RegExp}
 */
export function placeholderRegexCallback (text) {
	return (({config}) => {
		const {placeholder} = config;
		return new RegExp(`${escapeRegex(placeholder[0])}\\s*(${text})\\s*${escapeRegex(placeholder[1])}`, "gm");
	});
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
export function cleanTitle (title) {
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
 * @param info
 * @returns {info.input}
 */
export function generateReadme ({pkg, input, config}) {

	const {generators, silent, pkgName} = config;

	// Go through all of the generators and replace with the template
	for (const generator of generators) {
		input = input.replace(generator.regex({pkg, input, config}), (string, ...matches) => {
			let params = null;

			// If the params are required we extract them from the package.
			if (generator.params != null) {
				let errorReason;
				if (isFunction(generator.params)) {

					// Extract the params using the function
					params = generator.params({pkg, input, config, matches, string});

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
						console.log(colors.yellow(`[readme] - The readme template "${generator.name}" matched "${string}" but was skipped because ${errorReason}.`));
					}

					return string;
				}
			}

			return generator.template({pkg, input, config, ...params, generateReadme});
		})
	}

	return input;
}