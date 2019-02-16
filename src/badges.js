/**
 * Generate npm badges.
 * @param npmId
 * @returns {*[]}
 */
export function npmBadges ({npmId}) {
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
 */
export function githubBadges ({githubId}) {
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
 * @returns {{alt: string, url: string, img: string}[]}
 */
export function webcomponentsBadges ({webcomponentsId}) {
	return [
		{
			"alt": "Published on webcomponents.org",
			"url": `https://www.webcomponents.org/element/${webcomponentsId}`,
			"img": `https://img.shields.io/badge/webcomponents.org-published-blue.svg`
		}
	]
}