## Automatic documentation

Welcome to the future. Here we have **automatic documentation of web components!**. Let's say you have the following web component inside a file called `my-button.js`.

```javascript
/**
 * Button used for clicking!
 * @slot - Default content
 */
export class MyButton extends HTMLElement {

  /**
   * Attributes being observed.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ["disabled", "role"];
  }
  
  /**
   * Disables the element.
   * @attr
   * @type {boolean}
   */
  disabled = false;

  /**
   * Role of the element.
   * @attr
   * @type {string}
   */
  role = "button";
}

customElements.define("my-button", MyButton);
```

Then you can get automatic documentation for the web component by simply writing `{{ doc:my-button.js }}` which will result in the following content.

[[ doc:elements/my-button.js ]]

If you want to learn more about how the documentation is generated, check out [`web-component-analyzer`](https://github.com/runem/web-component-analyzer).