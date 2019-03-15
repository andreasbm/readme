// https://www.npmjs.com/package/check-links
declare module "check-links" {
	export default function checkLinks (links: string[]): Promise<{[key: string]: {status: "alive" | "dead" | "invalid", statusCode: number}}>;
}