import { Handler } from "hono";
import { html } from "hono/html";
import { HtmlEscapedString } from "hono/utils/html";

export function handleIndex(): Handler {
    return ({ html, req }) => {
        return html(
            <Html title="Web Audio API">
                <main>
                    <MidiMixer>
                        <MidiGroup midiChannel={0}>
                            <VolumeControl></VolumeControl>
                        </MidiGroup>
                        <MidiGroup midiChannel={1}>
                            <VolumeControl isMute={true}></VolumeControl>
                        </MidiGroup>
                    </MidiMixer>
                    <hr />
                    <AudioSample midiFor={0} srcUrl="/samples/kick.wav" />
                    <AudioSample midiFor={1} srcUrl="/samples/snare.wav" />
                </main>
            </Html>,
        );
    };
}

export function serveBundle(blob: Blob): Handler {
    return async ({ header, newResponse }) => {
        header("content-type", "application/javascript");
        return newResponse(await blob.arrayBuffer());
    };
};

export function streamAudio(): Handler<any, "/samples/:filename"> {
    return async ({ ...c }) => {
        const filename = c.req.param("filename");
        const audio = Bun.file(`./samples/${filename}`);

        const buffer = (await audio.arrayBuffer());
        return c.newResponse(buffer);
    };
}

export const MidiMixer = ({
    children = undefined as Children
}) => html`
<midi-mixer>
<template shadowRootMode="open">
    <style>
        slot[name=group] {
            display: flex;
            flex-direction: column;
        }
    </style>
    <slot name="group"></slot>
</template>
    ${children}
</midi-mixer>
`;

export const MidiGroup = ({
    // TODO channel should be 0 to 15
    children = undefined as Children,
    midiChannel = undefined as (undefined | number),
}) => html`
<midi-group slot="group" midi-channel="${midiChannel}">
<template shadowRootMode="open">
    <input 
        type="number"
        min="${0}"
        max="${15}"
        value="${midiChannel}"
        data-action="change:midi-group"
    >
    <slot name="volume"></slot>
</template>
    ${children}
</midi-group>
`;

export const VolumeControl = ({
    gainValue = 80,
    isMute = false
}) => html`
<volume-control
    slot="volume"
    is-mute="${isMute}"
    gain-value="${gainValue}"
>
<template shadowRootMode="open">
    <output
        data-target="volume-control.meter"
    >${gainValue.toString().padStart(3, "0")}</output>
    <input
        type="range"
        min="${0}"
        max="${127}"
        step="${1}"
        value="${gainValue}"
        data-action="input:volume-control"
        data-target="volume-control.fader"
    >
    <input 
        type="checkbox"
        data-action="change:volume-control"
        data-target="volume-control.mute"
    >
</template>
</volume-control>
`;

export const AudioSample = ({
    srcUrl = undefined as (string | undefined),
    midiFor = 0
}) => html`
<audio-sample src-url="${srcUrl}">
<template shadowRootMode="open">
    <button data-action="click:audio-sample">
        click me
    </button>
</template>
</audio-sample>
`;

type Children =
    | undefined
    | HtmlEscapedString
    | HtmlEscapedString[];

// <head> - https://htmlhead.dev/
export const Html = ({
    children = undefined as Children,
    title = ""
}) =>
    html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="preload" crossOrigin href="/client.js" as="script" />
    <script src="/client.js" async type="module"></script>
    
</head>
<body>
    ${children}
</body>
<script>
// https://developer.chrome.com/en/articles/declarative-shadow-dom/#polyfill
(function attachShadowRoots(root) {
    root.querySelectorAll("template[shadowrootmode]").forEach(template => {
        const mode = template.getAttribute("shadowrootmode");
        const shadowRoot = template.parentNode.attachShadow({ mode });
        shadowRoot.appendChild(template.content);
        template.remove();
        attachShadowRoots(shadowRoot);
    });
})(document);
</script>
</html>
`;