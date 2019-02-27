## Getting Started

Spend a minute reading this getting started guide and you'll have the best README file in your town. Promise.

### Blueprint

First you need to create a `blueprint.md` file. This blueprint is going to be the blueprint for the `README.md` file we will generate later.

Let's start simple. In order to get values from your `package.json` file injected into the README file we use the mustache syntax (`{{ .. }}`). Let's say your `package.json` file looks like this:

```json
{
  "name": "[[ pkg.name ]]",
  "version": "[[ pkg.version ]]"
}
```

To get the `name` and `version` into your README file you will need to write `{{ pkg.name }}` and `{{ pkg.version }}` in your `blueprint.md` file like this:

```markdown
Welcome to {{ pkg.name }}. This is version {{ pkg.version }}!
```

When running `[[ example.command ]]` the file `README.md` will be generated with the following contents:

```markdown
Welcome to [[ pkg.name ]]. This is version [[ pkg.version ]].
```

### Usage

Run the `[[ example.command ]]` command and a README file will be generated for you. If you want to go into depth with the readme command, check out the following options or write `[[ example.command ]] -h` in your terminal if that's your cup of tea.

[[ commandOptions ]]

### Configuration

To configure this library you'll need to create a `blueprint.json` file. This file is the configuration for the templates we are going to take a look at in the next section. If you want to interpolate values from the configuration file into your README file you can simply reference them without a scope. Eg. if you have the field "link" in your `blueprint.json` you can write `{{ link }}` to reference it.

Great. Now that we have the basics covered, let's continue and see how you can use templates!