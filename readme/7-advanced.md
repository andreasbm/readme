## Advanced!

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

[[ dependencies ]]


#### 1D Arrays

If you have a 1D array it will be formatted as a list. If you for example want to stamp the the `keywords` field from your `package.json` file you write `{{ keywords }}` and the keywords will be stamped in a nice formatted way like this:

[[ keywords ]]

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

[[ readme.table ]]

You are welcome!

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

If you want your own line design you can give the `readme.line` field an url to an image instead. If you prefer no line at all you can give the `readme.line` field the string "none".

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