## Custom templates

To create your own templates you'll first need to add the `readme.templates` array to your `package.json` file like this.

```json
{
  "readme": {
    "templates":[
      {
        "name": "install",
        "template": "Run `npm install [[ readme.ids.npm ]] to install this library!"
      }
    ]
  }
}
```

Then you can stamp your custom template using the `{{ template:install }}` syntax ('install' here referencing the name of the custom template).

[[ template:install ]]




