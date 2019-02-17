export enum LineColor {
	COLORED = "colored",
	DARK = "dark"
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

export interface IConfig {
	lineBreak: string;
	tab: string;
	inputName: string;
	pkgName: string;
	outputName: string;
	placeholder: PlaceholderSyntax;
	dry: boolean;
	silent: boolean;
	line: LineColor;
	generators: IGenerator<Params>[];
	templates: IUserTemplate[];
}

export type Package = Object;
export type Params = {[key: string]: string} | {optional?: {[key: string]: string}}
export type GenerateReadmeFunction = ({pkg: Package, input: string, config: IConfig}) => string;

export interface IGeneratorArgs {
	pkg: Package;
	input: string;
	config: IConfig;
}

export interface IGeneratorParamsArgs extends IGeneratorArgs {
	matches: RegExpMatchArray;
	string: string;
	generateReadme: GenerateReadmeFunction;
}

export interface IGenerator<T> {
	name: string;
	regex: (args: IGeneratorArgs) => RegExp;
	template: (args: {config: IConfig} & T) => string;
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
}

export type Bullet = string;
export type License = string;

export type LoadTemplateArgs = {content: string, generateReadme: GenerateReadmeFunction, config: IConfig, pkg: Package};
export type LogoTemplateArgs = {logo: ILogo};
export type LineTemplateArgs = {config: IConfig};
export type TitleTemplateArgs = {title: string, level: number, config: IConfig};
export type MainTitleTemplateArgs = {name: string};
export type BadgesTemplateArgs = {badges: IBadge[], config: IConfig};
export type DescriptionTemplateArgs = {description: string, text?: string, demo?: string};
export type BulletsTemplateArgs = {bullets: Bullet[], config: IConfig};
export type TableOfContentsTemplateArgs = {titles: string[], config: IConfig};
export type ContributorsTemplateArgs = {contributors: IContributor[], config: IConfig};
export type LicenseTemplateArgs = {license: License};
export type DemoTemplateArgs = {url: string};