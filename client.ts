/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { attr, controller, target } from "@github/catalyst/src";
import { consume, providable, provide } from "@github/catalyst/src/abilities";
// import { slot, slottable } from "@github/catalyst/src/slottable";

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


@controller
@providable
export class AudioMixerElement extends HTMLElement {
    @provide
    baseContext = new AudioContext();

    // @slot
    // plugin: HTMLSlotElement;

    connectedCallback() {
        // console.log(this.plugin.assignedNodes());
    }
}

@controller
@providable
export class AudioSampleElement extends HTMLElement {
    @attr
    srcUrl = "";

    @consume
    baseContext: AudioContext;

    declare buffer: AudioBuffer | undefined;

    async connectedCallback() {
        const res = await fetch(this.srcUrl);
        const arrayBuffer = await res.arrayBuffer();
        this.buffer = await this.baseContext.decodeAudioData(arrayBuffer);
    }

    async handleEvent() {
        const { buffer } = this;
        const sample = new AudioBufferSourceNode(this.baseContext, { buffer });
        sample.connect(this.baseContext.destination);
        sample.start(this.baseContext.currentTime);
    }
}

