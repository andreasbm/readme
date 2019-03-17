import { run } from "./run";

run(process.argv).catch(e => {
	console.log(e);
	process.exit(-1);
});
