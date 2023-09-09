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

const audioContext = new AudioContext();

@controller
export class AudioSampleElement extends HTMLElement {
    @attr
    srcUrl = "";

    declare buffer: AudioBuffer | undefined;

    async connectedCallback() {
        const res = await fetch(this.srcUrl);
        const arrayBuffer = await res.arrayBuffer();
        this.buffer = await audioContext.decodeAudioData(arrayBuffer);
    }

    async handleEvent() {
        const { buffer } = this;
        const sample = new AudioBufferSourceNode(audioContext, { buffer });
        sample.connect(audioContext.destination);
        sample.start(audioContext.currentTime);
    }
}
