/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { attr, controller, target } from "@github/catalyst/src";

@controller
export class HelloWorldElement extends HTMLElement {
    @attr
    userName = "Bun";

    @target
    declare me: HTMLSpanElement;

    connectedCallback() {
        this.me.textContent = this.userName;
    }
}