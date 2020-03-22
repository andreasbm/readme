{
	"name": "@appnest/readme",
	"version": "1.2.7",
	"description": "Automatically generate a beautiful best-practice README file based on the contents of your repository",
	"license": "MIT",
	"module": "index.esm.js",
	"main": "index.cjs.js",
	"types": "index.d.ts",
	"author": "Appnest",
	"scripts": {
		"prebuild": "node prebuild.js",
		"b:lib": "rollup -c && rollup -c=rollup-cli.config.js",
		"b:lib:prebuild": "npm run prebuild && npm run b:lib",
		"readme": "npm run b:lib && npm run generate:readme",
		"generate:readme": "node dist/cli.cjs.js generate",
		"publish": "cd dist && npm publish --access=public && cd ..",
		"git:add:commit:push": "git add . && git commit --no-edit --amend --no-verify && git push",
		"bump:patch": "npm version patch && npm run git:add:commit:push",
		"bump:minor": "npm version minor && npm run git:add:commit:push",
		"bump:major": "npm version major && npm run git:add:commit:push",
		"publish:patch": "npm run bump:patch && npm run b:lib:prebuild && npm run publish",
		"publish:minor": "npm run bump:minor && npm run b:lib:prebuild && npm run publish",
		"publish:major": "npm run bump:major && npm run b:lib:prebuild && npm run publish",
		"push:readme": "npm run readme && git add . && git commit -m 'New readme' && git push",
		"ncu": "ncu -u -a && npm update && npm install"
	},
	"bugs": {
		"url": "https://github.com/andreasbm/readme/issues"
	},
	"homepage": "https://github.com/andreasbm/readme#readme",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/andreasbm/readme.git"
	},
	"keywords": [
		"opensource",
		"project",
		"readme",
		"template",
		"boilerplate",
		"nodejs",
		"maintaining",
		"generator"
	],
	"contributors": [
		{
			"name": "Andreas Mehlsen",
			"url": "https://twitter.com/andreasmehlsen",
			"img": "https://avatars1.githubusercontent.com/u/6267397?s=460&v=4",
			"info": [
				"🔥"
			]
		},
		{
			"name": "You?",
			"img": "https://joeschmoe.io/api/v1/random",
			"url": "https://github.com/andreasbm/readme/blob/master/CONTRIBUTING.md"
		}
	],
	"bin": {
		"readme": "cli.cjs.js"
	},
	"dependencies": {
		"@types/glob": "^7.1.1",
		"check-links": "^1.1.8",
		"colors": "^1.4.0",
		"commander": "^5.0.0",
		"fs-extra": "^9.0.0",
		"glob": "^7.1.6",
		"path": "^0.12.7",
		"web-component-analyzer": "1.0.3"
	},
	"devDependencies": {
		"@types/fs-extra": "^8.1.0",
		"@wessberg/rollup-plugin-ts": "^1.2.21",
		"rimraf": "^3.0.2",
		"rollup": "^2.1.0",
		"rollup-plugin-commonjs": "^10.1.0",
		"rollup-plugin-json": "^4.0.0",
		"rollup-plugin-node-resolve": "^5.2.0"
	}
}
