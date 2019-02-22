export enum LineColor {
	AQUA = "aqua",
	CLOUDY = "cloudy",
	COLORED = "colored",
	CUT = "cut",
	DARK = "dark",
	FIRE = "fire",
	GRASS = "grass",
	RAINBOW = "rainbow",
	SOLAR = "solar",
	VINTAGE = "vintage",
	WATER = "water",
	NONE = "none"
}

export interface IBadge {
	alt: string;
	url: string;
	img: string;
}

export interface IGeneratorParamsError {
	error: string;
}

export interface IUserTemplate {
	name: string;
	template: string;
	params?: Params;
}

export type PlaceholderSyntax = [string, string];

// export interface IConfig {
// 	lineBreak: string;
// 	tab: string;
// 	blueprintName: string;
// 	pkgName: string;
// 	outputName: string;
// 	placeholder: PlaceholderSyntax;
// 	dry: boolean;
// 	silent: boolean;
// 	line: LineColor;
// 	generators: IGenerator<Params>[];
// 	templates: IUserTemplate[];
// }

export interface IConfig {
	blueprint: string
	output: string;
	help: boolean;
	text?: string;
	demo?: string;
	lineBreak: string;
	tab: string;
	silent: boolean;
	dry: boolean;
	logo?: ILogo;
	placeholder: PlaceholderSyntax;
	line: LineColor;
	templates?: IUserTemplate[];
	headingPrefix: {[key: number]: string}
	badges?: IBadge[];
}

export interface IPackage {
	name?: string;
	contributors?: IContributor[];
	license?: License;
	readme: IConfig
}

export interface IGeneratorArgs {
	pkg: IPackage;
	blueprint: string;
	pkgPath: string;
	generateReadme: GenerateReadmeFunction;
}

export type Params = {[key: string]: string} | {optional?: {[key: string]: string}}
export type GenerateReadmeFunction = ({pkg, blueprint, generators, pkgPath}: {pkg: IPackage, blueprint: string, generators: IGenerator<any>[], pkgPath: string}) => string;

export interface IGeneratorParamsArgs extends IGeneratorArgs {
	matches: RegExpMatchArray;
	string: string;
}

export interface IGenerator<T> {
	name: string;
	regex: (args: IGeneratorArgs) => RegExp;
	template: (args: T) => string;
	params?: Params | ((args: IGeneratorParamsArgs) => T | IGeneratorParamsError);
}

export interface ILogo {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
}

export interface IContributor {
	name: string;
	url?: string;
	email?: string;
	img?: string;
	info?: string[];
}

export type UserArgs =  {[key: string]: any};

export type Bullet = string;
export type License = string;

export type LoadTemplateArgs = {content: string, generateReadme: GenerateReadmeFunction, pkgPath: string, pkg: IPackage};
export type LogoTemplateArgs = {logo: ILogo};
export type LineTemplateArgs = {pkg: IPackage};
export type TitleTemplateArgs = {title: string, level: number, pkg: IPackage};
export type MainTitleTemplateArgs = {name: string};
export type BadgesTemplateArgs = {badges: IBadge[], pkg: IPackage};
export type DescriptionTemplateArgs = {description: string, text?: string, demo?: string};
export type BulletsTemplateArgs = {bullets: Bullet[], pkg: IPackage};
export type TableTemplateArgs = {content: string[][], pkg: IPackage};
export type TableOfContentsTemplateArgs = {titles: string[], pkg: IPackage};
export type ContributorsTemplateArgs = {contributors: IContributor[], pkg: IPackage};
export type LicenseTemplateArgs = {license: License};
export type DemoTemplateArgs = {url: string};