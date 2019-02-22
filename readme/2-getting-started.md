## Getting Started

Spend a minute reading this getting started guide and you'll have the best README file in your town. Promise.

### Blueprint

First you need to create a `blueprint.md` file. This blueprint is going to be the blueprint for the `README.md` file we will generate later.

Let's start simple. In order to get values from your `package.json` file injected into the readme we use the mustache syntax (`{{ .. }}`). Let's say your `package.json` file looks like this:

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

So run the `[[ readme.example.command ]]` command and a README file will be generated for you. If you want to go into depth with the readme command, check out the following options or write `[[ readme.example.command ]] -h` in your terminal if that's your cup of tea.

[[ readme.commandOptions ]]

Great. Now that we have the basics covered, let's continue and see how you can use templates!