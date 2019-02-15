const rimraf = require("rimraf");
const path = require("path");
const fse = require("fs-extra");
const rollup = require('rollup');
const pkg = require("./package.json");

const distPath = "dist";
const srcPath = "src";

const external = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
];

async function build () {
	await cleanDist();
	await transpile();
	await copyFiles("", distPath, [
		"README.md",
		"package.json"
	]);
}

async function transpile () {
	const readmeBundle = await rollup.rollup({
		input: `${srcPath}/index.js`,
		external,
		treeshake: false
	});

	await readmeBundle.write({
		file: `${distPath}/index.cjs.js`,
		format: "cjs"
	});

	await readmeBundle.write({
		file: `${distPath}/index.esm.js`,
		format: "esm"
	});
}

function cleanDist () {
	return new Promise((res, rej) => {
		rimraf(distPath, res);
	});
}

function copyFiles (inSrc, outSrc, files) {
	return new Promise((res, rej) => {
		for (const file of files) {
			copySync(`./${inSrc}/${file}`, `./${outSrc}/${file}`);
		}
		res();
	});
}

function copySync (src, dest) {
	fse.copySync(path.resolve(__dirname, src), path.resolve(__dirname, dest));
}

build().then(_ => {
	console.log("Done!");
});

