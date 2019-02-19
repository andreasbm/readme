## Advanced!

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

[[ dependencies ]]

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

