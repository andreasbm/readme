declare module "check-links" {
	export default function checkLinks (links: string[]): Promise<{[key: string]: {status: "alive" | "dead", statusCode: number}}>;
}