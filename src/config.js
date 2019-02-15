export const config = {
	LINE_BREAK: "\r\n",
	TAB: "\t",
	INPUT: "blueprint.md",
	PACKAGE: "package.json",
	OUTPUT: "README.md",
	VALUE_INTERPOLATION_REGEX: /{{[ ]*(.+?)[ ]*}}/g,
	TEMPLATE_INTERPOLATION_REGEX: /{{[ ]*(.+?)readme:[ ]*}}/g,
	DRY: false,
	SILENT: false,
	GITHUB_BADGES: [
		{
			"text": "Dependencies",
			"url": "https://david-dm.org/{{ readme.ids.github }}",
			"img": "https://img.shields.io/david/{{ readme.ids.github }}.svg"
		},
		{
			"text": "Contributors",
			"url": "https://github.com/{{ readme.ids.github }}/graphs/contributors",
			"img": "https://img.shields.io/github/contributors/{{ readme.ids.github }}.svg"
		}
	],
	NPM_BADGES: [
		{
			"text": "Downloads per month",
			"url": "https://npmcharts.com/compare/{{ readme.ids.npm }}?minimal=true",
			"img": "https://img.shields.io/npm/dm/{{ readme.ids.npm }}.svg"
		},
		{
			"text": "NPM Version",
			"url": "https://www.npmjs.com/package/{{ readme.ids.npm }}",
			"img": "https://img.shields.io/npm/v/{{ readme.ids.npm }}.svg"
		}
	],
	WEBCOMPONENTS_BADGES: [
		{
			"text": "Published on webcomponents.org",
			"url": "https://www.webcomponents.org/element/{{ readme.ids.webcomponents }}",
			"img": "https://img.shields.io/badge/webcomponents.org-published-blue.svg"
		}
	]
};


