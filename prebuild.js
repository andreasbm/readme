const rimraf = require("rimraf");
const path = require("path");
const colors = require("colors");
const fse = require("fs-extra");

const distPath = "dist";

async function prebuild () {
	await cleanDist();
	await copyFiles("", distPath, [
		"README.md",
		"package.json"
	]);
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

prebuild().then(_ => {
	console.log(colors.green("[prebuild] - Completed"));
});

