import { Handler } from "hono";
import { html } from "hono/html";
import { HtmlEscapedString } from "hono/utils/html";

export function handleIndex(): Handler {
    return ({ html, req, ...c }) => {
        const { q } = req.query();

        const url = new URL(req.url).origin;

        return html(
            <Html>
                <header>
                    <h1>Hello Bun!</h1>
                </header>
                <main>
                    <HelloWorld user-name="Fly.io" />
                    <HelloWorld user-name={q} />
                    <hr />
                    <p>The above message can be updated by passing a value for <code>q</code> as a search parameter into the url</p>
                    <p>As an example try <code>{`${url}?q=VALUE`}</code></p>
                    <hr />
                    <p>We can load audio from the server</p>
                    <AudioMixer src-url="/samples/snare.wav" />
                    <AudioMixer src-url="/samples/kick.wav" />
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

// <head> - https://htmlhead.dev/
export const Html = (
    { children, title }: {
        children?: HtmlEscapedString | HtmlEscapedString[];
        title?: string;
    },
) =>
    html`
<html>
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
</html>`;

export const HelloWorld = ({
    ["user-name"]: userName = "Bun"
}) => html`
<hello-world user-name="${userName}">
<template shadowRootMode="open">
    <p>
        My name is <span data-target="hello-world.me">${userName}</span>!
    </p>
</template>
</hello-world>`;

export const AudioMixer = ({
    children = undefined as (undefined | HtmlEscapedString | HtmlEscapedString[]),
    ["src-url"]: srcUrl = ""
}) => html`
<audio-mixer>
<template shadowRootMode="open">
    <slot></slot>
    ${AudioSample({ "src-url": srcUrl })}
</template>
    ${children}
</audio-mixer>
`;

export const AudioSample = ({
    ["src-url"]: srcUrl = undefined as (string | undefined)
}) => html`
<audio-sample src-url="${srcUrl}">
<template shadowRootMode="open">
    <button data-action="click:audio-sample">
        click me
    </button>
</template>
</audio-sample>`;