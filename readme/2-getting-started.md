## Getting Started

Spent a minute reading

### Blueprint

First you need to create a `blueprint.md` file (name it whatever you like). This blueprint is going to be the blueprint for the `README.md` file we are going to generate later.

Let's start simple. In order to get values from your `package.json` file injected into the readme we use the `{{ .. }}` syntax. Let's say your `package.json` file looks like this:

```json
{
  "name": "[[ name ]]",
  "version": "[[ version ]]"
}
```

To get the `name` and `version` into your readme you will need to write `{{ name }}` and `{{ version }}` in your `blueprint.md` file like this:

```markdown
Welcome to {{ name }}. This is version {{ version }}!
```

When running `[[ readme.example.command ]]` the file `README.md` will be generated with the following contents:

```markdown
Welcome to [[ name ]]. This is version [[ version ]].
```

### Usage

If you want to go into depth with the readme command, check out the following options.

[[ readme.commandOptions ]]

Great. Let's continue and see how you can use templates!