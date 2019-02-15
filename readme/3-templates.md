## 3. Templates

If you have come this far you are probably interested to figure out how to use readme templates. This library comes with a set of pre-defined templates to make your readme awesome, but you can of course create your own. More about that later, let's not get ahead of our self just yet.

The most simple template you can use is the title template. The way to generate a title is by writing `{{ readme:title }}` in your blueprint. When you run the readme command the template will generate the following:

[[ readme:title ]]

The important thing to note here is that the template automatically reads your `package.json` file and inserts the `name` from the package.



