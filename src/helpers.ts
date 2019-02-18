import { yellow } from "colors";
import {readFileSync, existsSync, outputFile} from "fs-extra";
import { resolve } from "path";
import { githubBadges, npmBadges, webcomponentsBadges } from "./badges";
import { IBadge, IGenerator, IGeneratorParamsArgs, IGeneratorParamsError, IPackage, Params } from "./model";

/**
 * Determines whether an object has the specified key.
 * @param obj
 * @param key
 */
export function hasKey (obj: Object, key: string): boolean {
	return getValue(obj, key) != null;
}

/**
 * Returns the license url.
 * @param license
 */
export function getLicenseUrl (license: string): string {
	return `https://opensource.org/licenses/${license}`;
}

/**
 * Returns a key from from an object for a key path.
 * @param obj
 * @param keyPath
 */
export function getValue<T> (obj: {[key: string]: any}, keyPath: string): T | null {
	let keys = keyPath.split(".");
	while (keys.length > 0 && obj != null) {
		keyPath = keys.shift()!;
		obj = obj[keyPath];
	}

	return <T | null>obj;
}

/**
 * Sets a value for a key path (".")
 * @param obj
 * @param keyPath
 * @param value
 */
export function setValue<T> (obj: {[key: string]: any}, keyPath: string, value: T) {
	let keys = keyPath.split(".");
	while (keys.length > 0 && obj != null) {

		// Set value for the last key
		if (keys.length === 1) {
			obj[keys.shift()!] = value;
			return;
		}

		obj = obj[keys.shift()!];
	}
}

/**
 * Validates the package.
 * @param obj
 * @param fileName
 */
export function validateObject ({obj, requiredFields}: {obj: Object, requiredFields: string[]}): boolean {
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
 */
export function isFunction (func: unknown): boolean {
	return typeof func === "function";
}

/**
 * Returns whether the obj is an object.
 * @param obj
 */
export function isObject (obj: unknown): boolean {
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
export function extractValues ({map, obj}: {map: {[key: string]: any}, obj: Object}) {
	const newObj = {};
	for (const [k, v] of (<any>Object).entries(map)) {
		(<any>newObj)[k] = getValue(obj, v);
	}

	return newObj;
}

/**
 * Returns available badges.
 * @param pkg
 */
export function getBadges ({pkg}: {pkg: IPackage}): IBadge[] {
	const badges: IBadge[] = [...(getValue<IBadge[]>(pkg, "readme.badges") || [])];

	const npmId = getValue<string>(pkg, "readme.ids.npm");
	const githubId = getValue<string>(pkg, "readme.ids.github");
	const webcomponentsId = getValue<string>(pkg, "readme.ids.webcomponents");

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

	return badges;
}

/**
 * Reads a file.
 * @param name
 */
export function readFile (name: string): string {
	return readFileSync(resolve(name)).toString("utf8");
}

/**
 * Reads the contents of a json file.
 * @param name
 */
export function readJSONFile (name: string): Object {
	return JSON.parse(readFile(name));
}

/**
 * Escapes a regex.
 * @param text
 */
export function escapeRegex (text: string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Returns a placeholder regex.
 * @param text
 */
export function placeholderRegexCallback (text: string): (({pkg}: {pkg: IPackage}) => RegExp) {
	return (({pkg}: {pkg: IPackage}) => {
		const {placeholder} = pkg.readme;
		return new RegExp(`${escapeRegex(placeholder[0])}\\s*(${text})\\s*${escapeRegex(placeholder[1])}`, "gm");
	});
}

/**
 * Writes a file to a path.
 * @param target
 * @param content
 */
export async function writeFile ({target, content}: {target: string, content: string}) {
	try {
		await outputFile(target, content);
	} catch (err) {
		console.error(err);
	}
}

/**
 * Returns the title for a level.
 * @param title
 * @param level
 */
export function getTitle ({title, level}: {title: string, level: number}): string {
	return `${level <= 2 ? `❯ ` : ""}${title}`;
}

/**
 * Cleans the title from weird symbols.
 * @param title
 */
export function cleanTitle (title: string): string {
	return title.replace(/[^a-zA-Z0-9-_ ]/g, "");
}

/**
 * Returns the title link.
 * @param title
 */
export function getTitleLink (title: string): string {
	return `#${cleanTitle(title).replace(/ /g, "-").toLowerCase()}`;
}

/**
 * Determines whether the file at the path exists.
 * @param absolutePath
 */
export function fileExists (absolutePath: string): boolean {
	return existsSync(absolutePath);
}

/**
 * Generates a readme.
 * @param pkg
 * @param blueprint
 * @param pkgPath
 * @param generators
 */
export function generateReadme ({pkg, blueprint, pkgPath, generators}: {pkg: IPackage, blueprint: string, pkgPath: string, generators: IGenerator<any>[]}): string {

	const {silent} = pkg.readme;

	// Go through all of the generators and replace with the template
	let defaultArgs = {pkg, pkgPath, generateReadme};
	for (const generator of generators) {
		blueprint = blueprint.replace(generator.regex({...defaultArgs, blueprint}), (string, ...matches) => {
			let params: any | null | Params | IGeneratorParamsError = null;

			// If the params are required we extract them from the package.
			if (generator.params != null) {
				let errorReason;
				if (isFunction(generator.params)) {

					// Extract the params using the function
					params = (<(args: IGeneratorParamsArgs) => any>generator.params)({
						...defaultArgs,
						blueprint,
						matches,
						string
					});

					// Validate the params
					if (params == null || params.error) {
						errorReason = (params || {}).error || `the params couldn't not be generated`;
					}

				} else {

					// Get the required and optional parameters
					const optionalParams = (<any>generator.params)["optional"] || [];
					const requiredParams = {...generator.params};
					delete requiredParams["optional"];

					// Validate the params
					if (!validateObject({obj: pkg, requiredFields: (<any>Object).values(requiredParams)})) {
						errorReason = `"${pkgPath}" is missing the keys "${(<any>Object).values(requiredParams)
						                                                                .join(", ")}"`;
					} else {
						params = extractValues({map: {...optionalParams, ...requiredParams}, obj: pkg});
					}
				}

				// If an error occurred print it and continue
				if (errorReason != null) {
					if (!silent) {
						console.log(yellow(`[readme] - The readme generator "${generator.name}" matched "${string}" but was skipped because ${errorReason}.`));
					}

					return string;
				}
			}

			return generator.template({...defaultArgs, blueprint, ...params});
		});
	}

	return blueprint;
}