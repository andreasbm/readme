## Custom templates

You are able to create your own templates to keep things as DRY as a hot summer day. To create your own templates you'll first need to add the `readme.templates` array to your `package.json` file like this.

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

Then you can stamp your custom template using the `{{ template:install }}` syntax ("install" here referencing the name of the custom template). The below is an example of what is stamped to the README file using the above template.

[[ template:install ]]

Be creative! You can for example add a template for code-snippets or [words you keep spelling wrong](https://en.oxforddictionaries.com/spelling/common-misspellings).