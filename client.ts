/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// https://docs.midi-mixer.com/terminology
import { attr, controller, target } from "@github/catalyst/src";
import { consume, providable, provide } from "@github/catalyst/src/abilities";
// import { slot, slottable } from "@github/catalyst/src/slottable";
import { forable } from "./forable";
import { loadable } from "./loadable";

const { log } = console;

@controller
@providable
export class MidiMixerElement extends HTMLElement {
    @provide
    baseContext = new AudioContext({
        latencyHint: "interactive",
    });
}

@controller
@providable
export class MidiGroupElement extends HTMLElement {
    @attr
    midiChannel = 0;

    connectedCallback() {
        console.log(this.midiChannel);
        this.id = `group#${this.midiChannel.toString().padEnd(2, "0")}`;
    }

    handleEvent(evt: Event) {
        log(evt);
    }
}

@controller
@providable
export class VolumeControlElement extends HTMLElement {
    @attr
    minValue = 0;

    @attr
    maxValue = 100;

    @attr
    gainValue = 80;

    @target
    declare fader: HTMLInputElement;

    @target
    declare meter: HTMLOutputElement;

    @attr
    isMute = false;

    @target
    declare mute: HTMLInputElement;

    connectedCallback() {
        this.meter.value = `${this.gainValue.toString().padStart(3, "0")}`
        this.isMute = this.mute.checked;
    }

    handleEvent(evt: Event) {
        switch (evt.type) {
            case "input":
                this.#handleInput();
                break;
            case "change":
                this.#handleCheck();
                break;
        }
    }

    #handleInput() {
        this.meter.textContent =
            (this.gainValue = this.fader.valueAsNumber)
                .toString()
                .padStart(3, "0");
    }

    #handleCheck() {
        this.fader.disabled =
            this.isMute = (this.mute.checked);
    }

    get valueWithPad() {
        return (this.fader.valueAsNumber).toString().padStart(3, "0");
    }
}

@controller
@forable /* order does not seem to matter */
@loadable
export class AudioSampleElement extends HTMLElement {
    baseContext = new AudioContext({
        latencyHint: "interactive",
    });

    declare buffer: AudioBuffer | undefined;

    forElementChangedCallback(newForElement: Element) {
        console.log({ element: newForElement });
    }

    async load(res: Response) {
        const arrayBuffer = await res.arrayBuffer();
        this.buffer = await this.baseContext.decodeAudioData(arrayBuffer);
    }

    async handleEvent() {
        const { buffer, baseContext } = this;
        const sample = new AudioBufferSourceNode(baseContext, { buffer });
        sample.connect(baseContext.destination);
        sample.start(baseContext.currentTime);
    }
}

