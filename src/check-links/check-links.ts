import { red } from "colors";
import * as linksCheck from "check-links";
import { checkLinksAliveness, getValue, readFile } from "../helpers";
import { Options } from "../model";
import {resolve} from "path";

/**
 * Runs the check links command.
 * @param options
 */
export async function checkLinksCommand (options: Options) {
	const path = getValue<string>(options, "input");

	// Ensure that a path exists
	if (path == null) {
		console.log(red(`[readme] - Could not resolve '${path}'.`));
		return;
	}

	const content = readFile(path);

	// Ensure that the file could be read
	if (content == null) {
		console.log(red(`[readme] - Could not read the file at path '${path}'.`));
		return;
	}

	await checkLinksAliveness(content);
}
