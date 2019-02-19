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
  <b>Generate beautiful best-practice and easy-to-maintain README files</b></br>
  <sub>Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression.<sub>
</p>

<br />


<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/demo.gif" alt="Demo" width="800" />
</p>

* **Simple:** Extremely simple to use - so simple that it almost feels like magic!
* **Powerful:** Customize almost everything - add your own templates and variables if you like
* **Awesome:** The tool you don't know you need before you have many different repositories that all need maintenance

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Table of Contents

* [❯ Installation](#-installation)
* [❯ Create a blueprint](#-create-a-blueprint)
* [❯ Templates](#-templates)
	* [Logo](#logo)
	* [Badges](#badges)
	* [Description](#description)
	* [Bullets](#bullets)
	* [Table of Contents](#table-of-contents)
	* [Contributors](#contributors)
* [❯ Contributors](#-contributors)
	* [License](#license)
* [❯ License](#-license)
* [❯ Load markdown files](#-load-markdown-files)
* [❯ A bit about this readme](#-a-bit-about-this-readme)
* [❯ Custom templates](#-custom-templates)
* [❯ Advanced!](#-advanced)
	* [New template syntax](#new-template-syntax)
	* [Arrays and objects](#arrays-and-objects)
	* [Different colored lines](#different-colored-lines)
* [❯ Featured README's](#-featured-readmes)
* [❯ Future work](#-future-work)
* [❯ Contributors](#-contributors)
* [❯ License](#-license)

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Installation

```javascript
npm install @appnest/readme -D
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Create a blueprint

First you need to create a `blueprint.md` file (name it whatever you like). This blueprint is going to be the blueprint for the `README.md` file we are going to generate later.

Let's start simple. In order to get values from your `package.json` file injected into the readme we use the `{{ .. }}` syntax. Let's say your `package.json` file looks like this:

```json
{
  "name": "@appnest/readme",
  "version": "1.0.12"
}
```

To get the `name` and `version` into your readme you will need to write `{{ name }}` and `{{ version }}` in your `blueprint.md` file like this:

```markdown
Welcome to {{ name }}. This is version {{ version }}!
```

When running `node node_modules/.bin/readme --blueprint=blueprint.md --output=README.md` the file `README.md` will be generated with the following contents:

```markdown
Welcome to @appnest/readme. This is version 1.0.12.
```

Great. Let's continue and see how you can use templates!

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Templates

If you have come this far you are probably interested to figure out how to use readme templates. This library comes with a set of pre-defined templates to make your readme awesome, but you can of course create your own. More about that later, let's not get ahead of our self just yet.

The most simple template you can use is the title template. The way to generate a title is by writing `{{ template:title }}` in your blueprint. When you run the `readme` command the template will generate the following:

<h1 align="center">@appnest/readme</h1>

The important thing to note here is that the template automatically reads your `package.json` file and inserts the `name` from the package. That's beautiful cool. Let's go through some of the other built-in templates you might want to add.

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
      "url": "https://github.com/andreasbm/readme/blob/master/assets/logo-shadow.png",
      "width": 150
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
  <b>Generate beautiful best-practice and easy-to-maintain README files</b></br>
  <sub>Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression.<sub>
</p>

<br />


Use the `{{ template:description }}` placeholder to stamp it. To use this template you are required to add the field `description` to your `package.json` file. Optionally you can also add the fields `readme.text` and `readme.demo` which will be presented below the description.

```json
{
  "description": "Generate beautiful best-practice and easy-to-maintain README files",
  "readme": {
    "text": "Use this readme generator to easily generate beautiful readme's like this one! Simply extend your <code>package.json</code> and create a readme blueprint. On Github, the README file is like the landing page of your website because it is the first thing visitors see. You want to make a good first impression.",
  }
}
```

### Bullets

The bullets template adds bullets to your readme and looks like this:

* **Simple:** Extremely simple to use - so simple that it almost feels like magic!
* **Powerful:** Customize almost everything - add your own templates and variables if you like
* **Awesome:** The tool you don't know you need before you have many different repositories that all need maintenance

Use the `{{ template:bullets }}` placeholder to stamp it. To use this template you are required to add the `readme.bullets` array to your `package.json` file. This array has to be an array of strings as shown below.

```json
{
  "description": "Generate beautiful README.md files with your new superpowers!",
  "readme": {
    "bullets": [
      "**Simple:** Extremely simple to use - so simple that it almost feels like magic!",
      "**Powerful:** Customize almost everything - add your own templates and variables if you like",
      "**Awesome:** The tool you don't know you need before you have many different repositories that all need maintenance"
    ]
  }
}
```

### Table of Contents

The table of contents template adds a table of contents and looks like this:


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Table of Contents

* [❯ Installation](#-installation)
* [❯ Create a blueprint](#-create-a-blueprint)
* [❯ Templates](#-templates)
	* [Logo](#logo)
	* [Badges](#badges)
	* [Description](#description)
	* [Bullets](#bullets)
	* [Table of Contents](#table-of-contents)
	* [Contributors](#contributors)
* [❯ Contributors](#-contributors)
	* [License](#license)
* [❯ License](#-license)
* [❯ Load markdown files](#-load-markdown-files)
* [❯ A bit about this readme](#-a-bit-about-this-readme)
* [❯ Custom templates](#-custom-templates)
* [❯ Advanced!](#-advanced)
	* [New template syntax](#new-template-syntax)
	* [Arrays and objects](#arrays-and-objects)
	* [Different colored lines](#different-colored-lines)
* [❯ Featured README's](#-featured-readmes)
* [❯ Future work](#-future-work)
* [❯ Contributors](#-contributors)
* [❯ License](#-license)

Use the `{{ template:toc }}` placeholder to stamp it. It has been scientifically proven that this template will save you approximately 392.3 hours during your life-time.

### Contributors

The contributors template adds the list of contributors and looks like this:


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Contributors
	
* <a href="https://twitter.com/andreasmehlsen">Andreas Mehlsen</a> (<a href="mailto:andmehlsen@gmail.com">andmehlsen@gmail.com</a>)

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


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).

Use the `{{ template:license }}` placeholder to stamp it. To use this template you are required to add the `license` field to your `package.json` file like this.

```json
{
  "license": "MIT"
}
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Load markdown files

What? You heard right. You can split the contents of your readme into multiple different files to make your life easier. Let's say you have a file called `my-section.md`. To stamp it you'll need to add `{{ load:my-section.md }}`.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ A bit about this readme

By now you are probably curious to know how this `README.md` was generated? It was created from the following `blueprint.md` file.

```markdown
{{ template:logo }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}
{{ template:bullets }}
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

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Custom templates

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

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Advanced!

Oh! So are you ready to open Pandora's box? Let's do it.

### New template syntax

If you are in the mood you can change the syntax used for matching with the templates. Let's say you want your placeholders to look like this instead `{[ template:title }]` you'll need to add the `readme.placeholder` array with the new syntax being `["{[", "}]"]` like this.


```json
{
  "readme": {
    "placeholder": ["{[", "}]"]
  }
}
```

### Arrays and objects

If you have an array or an object you want to stamp to your readme as a list just use the `{{ ... }}` syntax as usual. If you for example want to stamp the `dependencies` from your `package.json` file you write `{{ dependencies }}` and the dependencies will be stamped in a nice formatted way like this.

* **colors**: ^1.3.3
* **fs-extra**: ^7.0.1
* **minimist**: ^1.2.0
* **path**: ^0.12.7

### Different colored lines

If you want to change the color of the lines above headers you can change the `readme.line` field in the `package.json`. You can either choose `dark` or `colored` values.

```json
{
  "readme": {
    "line": "dark"
  }
}
```

The following is the dark variant of the line.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-dark.png)

Yeah! Dark mode on your `README.md` is awesome indeed.



![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Featured README's

If you use this generator for one of your projects I would love to hear about it so I can feature it. Here's a list of some repositories using this generator for their README file.

* [lit-translate](https://github.com/andreasbm/lit-translate)
* [masonry-layout](https://github.com/andreasbm/masonry-layout)
* [focus-trap](https://github.com/andreasbm/focus-trap)
* [web-router](https://github.com/andreasbm/web-router)
* [web-config](https://github.com/andreasbm/web-config)

As inspiration for the layout of the generated README files I initially found inspiration from [terkelg's brilliant repository called prompts](https://github.com/terkelg/prompts) - a prime example on how every README file should look! I therefore wanted to mention him here even though he doesn't use this README generator. If you want to see an example of a brilliant README file you should definitely check his repository out.


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Future work

That's it for now! Lot's of exiting features a going to be added in the future. If you stumble upon an issue or have a feature request you are very welcome to open a Github issue or pull request. Have a great day!


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ Contributors
	
* <a href="https://twitter.com/andreasmehlsen">Andreas Mehlsen</a> (<a href="mailto:andmehlsen@gmail.com">andmehlsen@gmail.com</a>)

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/line-colored.png)

## ❯ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).

[new-line](data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTAwcHgi%0D%0AIGhlaWdodD0iNTAwcHgiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5z%0D%0APSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMu%0D%0Ab3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MS4zICg1NzU0NCkg%0D%0ALSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bG9n%0D%0AbzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZz%0D%0APgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdo%0D%0AdD0iNTAwIj48L3JlY3Q+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI1MC4wMDQwMjQ0JSIg%0D%0AeTE9IjUwJSIgeDI9IjQ5Ljk1MDYxNzQlIiB5Mj0iNTAlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+%0D%0ACiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGN0JENDAiIG9mZnNldD0iMCUiPjwvc3Rv%0D%0AcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0REOTcwMCIgb2Zmc2V0PSIxMDAlIj48%0D%0AL3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJs%0D%0Ab2dvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxl%0D%0APSJldmVub2RkIj4KICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAg%0D%0AICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgog%0D%0AICAgICAgIDx1c2UgaWQ9IlJlY3RhbmdsZS00IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5v%0D%0Abnplcm8iIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgIDxjaXJjbGUgaWQ9Ik92%0D%0AYWwtMiIgZmlsbD0iIzk0QUZDMCIgZmlsbC1ydWxlPSJub256ZXJvIiBtYXNrPSJ1cmwoI21hc2st%0D%0AMikiIGN4PSIyMjYuNSIgY3k9IjI0Ny41IiByPSIyMDguNSI+PC9jaXJjbGU+CiAgICAgICAgPHBh%0D%0AdGggZD0iTS03OSwtMyBMMzUxLC0zIEwzNTEsNDI3IEMzNTEsNDY3LjMxNjc4NyAzMTguMzE2Nzg3%0D%0ALDUwMCAyNzgsNTAwIEwtNzksNTAwIEMtMTE5LjMxNjc4Nyw1MDAgLTE1Miw0NjcuMzE2Nzg3IC0x%0D%0ANTIsNDI3IEwtMTUyLDcwIEMtMTUyLDI5LjY4MzIxMzMgLTExOS4zMTY3ODcsLTMgLTc5LC0zIFoi%0D%0AIGlkPSJSZWN0YW5nbGUiIGZpbGw9IiMyMjg5QjYiIGZpbGwtcnVsZT0ibm9uemVybyIgbWFzaz0i%0D%0AdXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgPHBhdGggZD0iTS04NCwtNiBMMzI3LC02IEwz%0D%0AMjcsNDA1IEMzMjcsNDQ1LjMxNjc4NyAyOTQuMzE2Nzg3LDQ3OCAyNTQsNDc4IEwtODQsNDc4IEMt%0D%0AMTI0LjMxNjc4Nyw0NzggLTE1Nyw0NDUuMzE2Nzg3IC0xNTcsNDA1IEwtMTU3LDY3IEMtMTU3LDI2%0D%0ALjY4MzIxMzMgLTEyNC4zMTY3ODcsLTYgLTg0LC02IFoiIGlkPSJSZWN0YW5nbGUiIGZpbGw9IiNG%0D%0ARkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAg%0D%0AICAgICAgPGcgaWQ9Ikdyb3VwIiBtYXNrPSJ1cmwoI21hc2stMikiIGZpbGw9IiNEQ0U0RTgiIGZp%0D%0AbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ3%0D%0ALjAwMDAwMCwgMjIzLjAwMDAwMCkiIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICA8%0D%0AcmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjM0IiBoZWlnaHQ9IjE4IiByeD0iOSI+PC9yZWN0Pgog%0D%0AICAgICAgICAgICAgICAgPHJlY3QgeD0iMCIgeT0iNzYuNSIgd2lkdGg9IjIzNCIgaGVpZ2h0PSIx%0D%0AOCIgcng9IjkiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxyZWN0IHg9IjAiIHk9IjE1MyIgd2lk%0D%0AdGg9IjIzNCIgaGVpZ2h0PSIxOCIgcng9IjkiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAg%0D%0AICAgIDwvZz4KICAgICAgICA8cGF0aCBkPSJNMjI2LjA4NDM4Miw2Ni42MTE0NzgzIEMyMzEuNjk0%0D%0ANTMzLDUzLjMwMjI2MDkgMjQ0LjUxMDU4OSw0NC4wMDI3ODI2IDI1OS40MTcyNDUsNDQuMDAyNzgy%0D%0ANiBDMjc5LjQ5NzU4NSw0NC4wMDI3ODI2IDI5My45NTk0MzMsNjEuMTk2NTIxNyAyOTUuNzc3NTks%0D%0AODEuNjg3NjUyMiBDMjk1Ljc3NzU5LDgxLjY4NzY1MjIgMjk2Ljc1ODk0OSw4Ni43NzQyNjA5IDI5%0D%0ANC41OTg4NDYsOTUuOTMxODI2MSBDMjkxLjY1NzU0NywxMDguNDAzNDc4IDI4NC43NDM1NSwxMTku%0D%0ANDgzODI2IDI3NS40MjIwMjQsMTI3Ljk0MDE3NCBMMjI2LjA4NDM4MiwxNzIgTDE3Ny41Nzc5NzYs%0D%0AMTI3LjkzNzM5MSBDMTY4LjI1NjQ1LDExOS40ODM4MjYgMTYxLjM0MjQ1MywxMDguNDAwNjk2IDE1%0D%0AOC40MDExNTQsOTUuOTI5MDQzNSBDMTU2LjI0MTA1MSw4Ni43NzE0NzgzIDE1Ny4yMjI0MSw4MS42%0D%0AODQ4Njk2IDE1Ny4yMjI0MSw4MS42ODQ4Njk2IEMxNTkuMDQwNTY3LDYxLjE5MzczOTEgMTczLjUw%0D%0AMjQxNSw0NCAxOTMuNTgyNzU1LDQ0IEMyMDguNDkyMTkxLDQ0IDIyMC40NzQyMyw1My4zMDIyNjA5%0D%0AIDIyNi4wODQzODIsNjYuNjExNDc4MyBaIiBpZD0iU2hhcGUiIGZpbGw9IiNFMDE2MEEiIGZpbGwt%0D%0AcnVsZT0ibm9uemVybyIgbWFzaz0idXJsKCNtYXNrLTIpIj48L3BhdGg+CiAgICAgICAgPHBhdGgg%0D%0AZD0iTTY1LDAgTDEyNiwwIEwxMjYsMTM3LjE5MTExMyBDMTI2LDEzOS40MDAyNTIgMTI0LjIwOTEz%0D%0AOSwxNDEuMTkxMTEzIDEyMiwxNDEuMTkxMTEzIEMxMjEuMzE4MzM4LDE0MS4xOTExMTMgMTIwLjY0%0D%0ANzk4NSwxNDEuMDE2OTEgMTIwLjA1MjU2NywxNDAuNjg1MDM3IEw5NS41LDEyNyBMNzAuOTQ3NDMz%0D%0ALDE0MC42ODUwMzcgQzY5LjAxNzc5MjEsMTQxLjc2MDU3NSA2Ni41ODE2MTM2LDE0MS4wNjgxODcg%0D%0ANjUuNTA2MDc2LDEzOS4xMzg1NDYgQzY1LjE3NDIwMzUsMTM4LjU0MzEyOCA2NSwxMzcuODcyNzc1%0D%0AIDY1LDEzNy4xOTExMTMgTDY1LDAgWiIgaWQ9IlJlY3RhbmdsZS0zIiBmaWxsPSJ1cmwoI2xpbmVh%0D%0AckdyYWRpZW50LTMpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIG1hc2s9InVybCgjbWFzay0yKSI+PC9w%0D%0AYXRoPgogICAgPC9nPgo8L3N2Zz4=)