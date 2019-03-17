import { IBadge } from "../model";

/**
 * Generate npm badges.
 * @param npmId
 */
export function npmBadges ({npmId}: {npmId: string}): IBadge[] {
	return [
		{
			"alt": "Downloads per month",
			"url": `https://npmcharts.com/compare/${npmId}?minimal=true`,
			"img": `https://img.shields.io/npm/dm/${npmId}.svg`
		},
		{
			"alt": "NPM Version",
			"url": `https://www.npmjs.com/package/${npmId}`,
			"img": `https://img.shields.io/npm/v/${npmId}.svg`
		}
	]
}

/**
 * Generate github badges.
 * @param githubId
 */
export function githubBadges ({githubId}: {githubId: string}): IBadge[] {
	return [
		{
			"alt": "Dependencies",
			"url": `https://david-dm.org/${githubId}`,
			"img": `https://img.shields.io/david/${githubId}.svg`
		},
		{
			"alt": "Contributors",
			"url": `https://github.com/${githubId}/graphs/contributors`,
			"img": `https://img.shields.io/github/contributors/${githubId}.svg`
		}
	]
}

/**
 * Generates the webcomponents badges.
 * @param webcomponentsId
 */
export function webcomponentsBadges ({webcomponentsId}: {webcomponentsId: string}): IBadge[] {
	return [
		{
			"alt": "Published on webcomponents.org",
			"url": `https://www.webcomponents.org/element/${webcomponentsId}`,
			"img": `https://img.shields.io/badge/webcomponents.org-published-blue.svg`
		}
	]
}