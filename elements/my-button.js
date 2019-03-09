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