<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/logo-shadow.png" alt="Logo" width="150" height="150" />
</p>
<h1 align="center">@appnest/readme</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@appnest/readme?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@appnest/readme.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@appnest/readme"><img alt="NPM Version" src="https://img.shields.io/npm/v/@appnest/readme.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/readme"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/readme.svg" height="20"/></a>
<a href="https://github.com/andreasbm/readme/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/readme.svg" height="20"/></a>
<a href="https://github.com/badges/shields"><img alt="Custom badge" src="https://img.shields.io/badge/custom-badge-f39f37.svg" height="20"/></a>
<a href="https://github.com/andreasbm/readme/graphs/commit-activity"><img alt="Maintained" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Automatically generate a beautiful best-practice README file based on the contents of your repository</b></br>
  <sub>Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression.<sub>
</p>

<br />


<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/demo.gif" alt="Demo" width="800" />
</p>

* **Simple**: Extremely simple to use - so simple that it almost feels like magic!
* **Powerful**: Customize almost everything - add your own templates and variables if you like
* **Awesome**: The tool you don't know you need before you have many different repositories that all need maintenance

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Table of Contents

* [➤ Installation](#-installation)
* [➤ Getting Started](#-getting-started)
	* [Blueprint](#blueprint)
	* [Usage](#usage)
* [➤ Templates](#-templates)
	* [Title](#title)
	* [Logo](#logo)
	* [Badges](#badges)
	* [Description](#description)
	* [Table of Contents](#table-of-contents)
	* [Contributors](#contributors)
* [➤ Contributors](#-contributors)
	* [License](#license)
* [➤ License](#-license)
* [➤ Load markdown files](#-load-markdown-files)
* [➤ A bit about this readme](#-a-bit-about-this-readme)
* [➤ Custom templates](#-custom-templates)
* [➤ Advanced!](#-advanced)
	* [New template syntax](#new-template-syntax)
	* [Variables](#variables)
		* [Objects](#objects)
		* [1D Arrays](#1d-arrays)
		* [2D Arrays](#2d-arrays)
	* [Different colored lines](#different-colored-lines)
	* [Different formatted headings](#different-formatted-headings)
* [➤ Featured README's](#-featured-readmes)
* [➤ Future work](#-future-work)
* [➤ FAQ](#-faq)
	* [Can I see how my README file is going to look before I commit it?](#can-i-see-how-my-readme-file-is-going-to-look-before-i-commit-it)
	* [How can I get involved?](#how-can-i-get-involved)
	* [I already have a large README file - I don't have time to rewrite everything!](#i-already-have-a-large-readme-file---i-dont-have-time-to-rewrite-everything)
	* [How can I support you?](#how-can-i-support-you)
* [➤ Contributors](#-contributors)
* [➤ License](#-license)

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Installation

```javascript
npm install @appnest/readme -D
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Getting Started

Spent a minute reading

### Blueprint

First you need to create a `blueprint.md` file (name it whatever you like). This blueprint is going to be the blueprint for the `README.md` file we are going to generate later.

Let's start simple. In order to get values from your `package.json` file injected into the readme we use the `{{ .. }}` syntax. Let's say your `package.json` file looks like this:

```json
{
  "name": "@appnest/readme",
  "version": "1.0.18"
}
```

To get the `name` and `version` into your readme you will need to write `{{ name }}` and `{{ version }}` in your `blueprint.md` file like this:

```markdown
Welcome to {{ name }}. This is version {{ version }}!
```

When running `node node_modules/.bin/readme --b=blueprint.md --o=README.md` the file `README.md` will be generated with the following contents:

```markdown
Welcome to @appnest/readme. This is version 1.0.18.
```

### Usage

If you want to go into depth with the readme command, check out the following options.

| Option | Type | Description |
| ------- | ------- | ------- |
| -p, --package | string | Path of the 'package.json' file. Defaults to 'package.json'. |
| --name | string | Name of the project. Used for the 'title' template. |
| --contributors | {name: string; email: string; url: string; img: string;}[] | Contributors of the project. Used for the 'contributors' template. |
| --license | string | License kind. Used for the 'license' template. |
| -o, --readme.output | string | Path of the generated README file. Defaults to 'README.md'. |
| -h, --readme.help |  | Display this help message. |
| -b, --readme.blueprint | string | The blueprint. Defaults to 'blueprint.md'. |
| --readme.badges | {alt: string, url: string, img: string}[] | Badges. Used for the 'badges' template. |
| --readme.text | string | Text describing your project. Used for the 'description' template. |
| --readme.demo | string | Demo url for your project. Used for the 'description' template. |
| --readme.lineBreak | string | The linebreak used in the generation of the README file. Defaults to 'rn' |
| --readme.tab | string | The tab used in the generation of the README file. Defaults to 't' |
| --readme.placeholder | [string, string] | The placeholder syntax used when looking for templates in the blueprint. Defaults to '["{{", "}}"]. |
| --readme.line | string | The line style of the titles. Can also be an URL. Defaults to 'colored'. |
| --readme.templates | {name: string, template: string}[] | User created templates. |
| -s, --readme.silent | boolean | Whether the console output from the command should be silent. |
| -d, --readme.dry | boolean | Whether the command should run as dry. If dry, the output file is notgenerated but outputted to the console instead. |
| --readme.headingPrefix | {[key: number]: string} | The prefix of the header tags. Defaults to '{1: "➤ ", 2: "➤ "}' |
| --logo | {url: string; alt?: string; width?: number; height?: number;} | The logo information. Used for the 'logo' template. |

Great. Let's continue and see how you can use templates!

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Templates

If you have come this far you are probably interested to figure out how to use readme templates. This library comes with a set of pre-defined templates to make your readme awesome, but you can of course create your own. More about that later, let's not get ahead of our self just yet.

### Title

The most simple template you can use is the title template. The way to generate a title is by writing `{{ template:title }}` in your blueprint. When you run the `readme` command the template will generate the following:

<h1 align="center">@appnest/readme</h1>

The important thing to note here is that the template automatically reads your `package.json` file and inserts the `name` from the package.

```json
{
  "name": "@appnest/readme"
}
```

That's cool. Let's go through some of the other built-in templates you might want to add.

### Logo

The logo template adds a logo to your readme and looks like this:

<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/logo-shadow.png" alt="Logo" width="150" height="150" />
</p>

Use the placeholder `{{ template:logo }}` to stamp it. You will need to add the `readme.logo` field to your `package.json`. The logo field requires an `url` field and the fields `width`, `height` and `alt` are optional. Below is an example on how to add a logo.

```json
{
  "readme": {
    "logo": {
      "url": "https://raw.githubusercontent.com/andreasbm/readme/master/assets/logo-shadow.png",
      "width": "150"
    }
  }
}
```

### Badges

The badges template adds badges to your readme and looks like this:

<p align="center">
		<a href="https://npmcharts.com/compare/@appnest/readme?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@appnest/readme.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@appnest/readme"><img alt="NPM Version" src="https://img.shields.io/npm/v/@appnest/readme.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/readme"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/readme.svg" height="20"/></a>
<a href="https://github.com/andreasbm/readme/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/readme.svg" height="20"/></a>
<a href="https://github.com/badges/shields"><img alt="Custom badge" src="https://img.shields.io/badge/custom-badge-f39f37.svg" height="20"/></a>
<a href="https://github.com/andreasbm/readme/graphs/commit-activity"><img alt="Maintained" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" height="20"/></a>
	</p>


Use the `{{ template:badges }}` placeholder to stamp it. You will need to add the information about how the badges should be generated. For that you can extend the "readme.ids" property in your `package.json` add the `npm` and `github` ids (both are optional). If you want to add your own badges you can use the `readme.badges` field.

```json
{
  "readme": {
    "ids": {
      "github": "andreasbm/readme",
      "npm": "@appnest/readme"
    },
    "badges": [
      {
        "alt": "Custom badge",
        "url": "https://github.com/badges/shields",
        "img": "https://img.shields.io/badge/custom-badge-f39f37.svg"
      }
    ]
  }
}
```

If you need some inspiration for badges, check [this website](https://shields.io/) out.

### Description

The description template adds a description to your readme and looks like this:

<p align="center">
  <b>Automatically generate a beautiful best-practice README file based on the contents of your repository</b></br>
  <sub>Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression.<sub>
</p>

<br />


Use the `{{ template:description }}` placeholder to stamp it. To use this template you are required to add the field `description` to your `package.json` file. Optionally you can also add the fields `readme.text` and `readme.demo` which will be presented below the description.

```json
{
  "description": "Automatically generate a beautiful best-practice README file based on the contents of your repository",
  "readme": {
    "text": "Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression."
  }
}
```

### Table of Contents

The table of contents template adds a table of contents and looks like this:


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Table of Contents

* [➤ Installation](#-installation)
* [➤ Getting Started](#-getting-started)
	* [Blueprint](#blueprint)
	* [Usage](#usage)
* [➤ Templates](#-templates)
	* [Title](#title)
	* [Logo](#logo)
	* [Badges](#badges)
	* [Description](#description)
	* [Table of Contents](#table-of-contents)
	* [Contributors](#contributors)
* [➤ Contributors](#-contributors)
	* [License](#license)
* [➤ License](#-license)
* [➤ Load markdown files](#-load-markdown-files)
* [➤ A bit about this readme](#-a-bit-about-this-readme)
* [➤ Custom templates](#-custom-templates)
* [➤ Advanced!](#-advanced)
	* [New template syntax](#new-template-syntax)
	* [Variables](#variables)
		* [Objects](#objects)
		* [1D Arrays](#1d-arrays)
		* [2D Arrays](#2d-arrays)
	* [Different colored lines](#different-colored-lines)
	* [Different formatted headings](#different-formatted-headings)
* [➤ Featured README's](#-featured-readmes)
* [➤ Future work](#-future-work)
* [➤ FAQ](#-faq)
	* [Can I see how my README file is going to look before I commit it?](#can-i-see-how-my-readme-file-is-going-to-look-before-i-commit-it)
	* [How can I get involved?](#how-can-i-get-involved)
	* [I already have a large README file - I don't have time to rewrite everything!](#i-already-have-a-large-readme-file---i-dont-have-time-to-rewrite-everything)
	* [How can I support you?](#how-can-i-support-you)
* [➤ Contributors](#-contributors)
* [➤ License](#-license)

Use the `{{ template:toc }}` placeholder to stamp it. It has been scientifically proven that this template will save you approximately 392.3 hours during your life-time.

### Contributors

The contributors template adds the list of contributors and looks like this:


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Contributors
	
[<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen)
:---: | :---: | :---: | :---: | :---: | :---: | :---:
[Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com))

[<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen)
:---: | :---: | :---: | :---: | :---: | :---: | :---:
[Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com))


Use the `{{ template:contributors }}` placeholder to stamp it. To use this template your are required to add the `contributors` array to your `package.json` file like this.

```json
{
  "contributors": [
    {
      "name": "Andreas Mehlsen",
      "email": "andmehlsen@gmail.com",
      "url": "https://twitter.com/andreasmehlsen"
    }
  ]
}
```

### License

The license template adds a license section and looks like this:


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).

Use the `{{ template:license }}` placeholder to stamp it. To use this template you are required to add the `license` field to your `package.json` file like this.

```json
{
  "license": "MIT"
}
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Load markdown files

What? You heard right. You can split the contents of your readme into multiple different files to make your life easier. Let's say you have a file called `my-section.md`. To stamp it you'll need to add `{{ load:my-section.md }}`.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ A bit about this readme

By now you are probably curious to know how this `README.md` was generated? It was created from the following `blueprint.md` file.

```markdown
{{ template:logo }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}
{{ readme.bullets }}
{{ template:toc }}
{{ load:readme/1-installation.md }}
{{ load:readme/2-create-blueprint.md }}
{{ load:readme/3-templates.md }}
{{ load:readme/4-load-markdown.md }}
{{ load:readme/5-this-readme.md }}
{{ load:readme/6-custom-templates.md }}
{{ load:readme/7-advanced.md }}
{{ load:readme/8-future-work.md }}
{{ template:contributors }}
{{ template:license }}
```

It really couldn't be more simple that this.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Custom templates

To create your own templates you'll first need to add the `readme.templates` array to your `package.json` file like this.

```json
{
  "readme": {
    "templates":[
      {
        "name": "install",
        "template": "Run `npm install {{ readme.ids.npm }} to install this library!"
      }
    ]
  }
}
```

Then you can stamp your custom template using the `{{ template:install }}` syntax ('install' here referencing the name of the custom template).

Run `npm install @appnest/readme' to install this library!

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Advanced!

Oh! So are you ready to open Pandora's box? Let's do it.

### New template syntax

If you are in the mood you can change the syntax used for matching with the templates. Let's say you want your placeholders to look like this instead `{[ template:title }]`. Then you'll need to add the `readme.placeholder` array with the new syntax being `["{[", "}]"]` like this.


```json
{
  "readme": {
    "placeholder": ["{[", "}]"]
  }
}
```

### Variables

If you have a variable from your `package.json` file you want to stamp to your readme just use the `{{ ... }}` syntax as usual.

#### Objects

Objects are formatted as a list with the keys being bold. If you for example want to stamp the `dependencies` field from your `package.json` file you write `{{ dependencies }}` and the dependencies will be stamped in a nice formatted way like this.

* **colors**: ^1.3.3
* **command-line-usage**: ^5.0.5
* **fs-extra**: ^7.0.1
* **minimist**: ^1.2.0
* **path**: ^0.12.7


#### 1D Arrays

If you have a 1D array it will be formatted as a list. If you for example want to stamp the the `keywords` field from your `package.json` file you write `{{ keywords }}` and the keywords will be stamped in a nice formatted way like this:

* readme
* template
* boilerplate
* nodejs
* opensource
* maintaining
* generator

#### 2D Arrays

If you have a 2D array it will be formatted as a table. This is very convenient for things like documentation of API's. Let's say you have the following in your `package.json`.

```json
{
  "readme": {
    "table": [
      ["Attribute", "Type", "Description"],
      ["**size**", "'medium', 'large'", "Determines the size" ],
      ["**active**", "boolean", "Whether the element is active or not" ]
    ]
  }
}
```

Then you can stamp it to your readme by writing `{{ readme.table }}` and it will be formatted as a table.

| Attribute | Type | Description |
| ------- | ------- | ------- |
| **size** | 'medium', 'large' | Determines the size |
| **active** | boolean | Whether the element is active or not |

You are welcome!

### Different colored lines

If you want to change the color of the lines above headers you can change the `readme.line` field in the `package.json`. Here's an example if you want a dark line instead of the colored one.

```json
{
  "readme": {
    "line": "dark"
  }
}
```

The following is the dark variant of the line.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png)

Yeah! Dark mode on your `README.md` is awesome indeed. You have other options besides dark mode. Here's all the line styles you can choose from.

* "aqua" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)
* "cloudy" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cloudy.png)
* "colored" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)
* "cut" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/cut.png)
* "dark" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png)
* "fire" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png)
* "grass" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/grass.png)
* "rainbow" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
* "solar" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png)
* "vintage" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/vintage.png)
* "water" ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png)

If you want your own line design you can give the `readme.line` field an url to an image instead. It is recommended that this image is 900px in width. If you prefer no line at all you can give the `readme.line` field the string "none".

### Different formatted headings

If you want to change the prefix in front of the heading you can change the `readme.headingPrefix` in the `package.json` file. Just map the heading level to the desired prefix as shown below.

```json
{
  "headingPrefix": {
    "1": "➜ ",
    "2": "⭑ "
  }
}
```

If you want some inspiration for symbols you can put infront of the headings you can check out [this](https://unicodes.smpc.io/) website.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Featured README's

If you use this generator for one of your projects I would love to hear about it so I can feature it. Here's a list of some repositories using this generator for their README file.

* [lit-translate](https://github.com/andreasbm/lit-translate)
* [masonry-layout](https://github.com/andreasbm/masonry-layout)
* [focus-trap](https://github.com/andreasbm/focus-trap)
* [web-router](https://github.com/andreasbm/web-router)
* [web-config](https://github.com/andreasbm/web-config)

As inspiration for the layout of the generated README files I initially found inspiration from [terkelg's brilliant repository called prompts](https://github.com/terkelg/prompts) - a prime example on how every README file should look! I therefore wanted to mention him here even though he doesn't use this README generator. If you want to see an example of a brilliant README file you should definitely check his repository out.


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Future work

That's it for now! Lot's of exiting features a going to be added in the future. If you stumble upon an issue or have a feature request you are very welcome to open a Github issue or pull request. Have a great day!


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ FAQ

### Can I see how my README file is going to look before I commit it?

Yes you definitely can! There are lots of tools out there for editing/previewing Github flavored markdown. I recommend using [https://stackedit.io/app](https://stackedit.io/app) to preview the final result since it is super lightweight and does it job well.

### How can I get involved?

Create an issue or pull-request. You are also very welcome to throw me a message at [@AndreasMehlsen](https://twitter.com/andreasmehlsen).

### I already have a large README file - I don't have time to rewrite everything!

No problem at all! Your first step can be to rename your `README.md` to `blueprint.md` and run `node node_modules/.bin/readme --b=blueprint.md --o=README.md`. Already then your README should now be well-formatted. Then you can slowly replace the contents when you have time. The low-hanging fruit would be to add the table of contents and license using respectively the `{{ template:toc }}` and `{{ template:license }}` templates.

### How can I support you?

There are lot's of ways to support me! I would be so happy if you gave this repository a star, Tweeted about it or told your friends about this little corner of the Internet ❤️


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ Contributors
	
[<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen)
:---: | :---: | :---: | :---: | :---: | :---: | :---:
[Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com))

[<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen)
:---: | :---: | :---: | :---: | :---: | :---: | :---:
[Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com)) | [Andreas Mehlsen](https://twitter.com/andreasmehlsen)([andmehlsen@gmail.com](mailto:andmehlsen@gmail.com))


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).