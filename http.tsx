import { Handler } from "hono";
import { html } from "hono/html";
import { HtmlEscapedString } from "hono/utils/html";

export function handleIndex(): Handler {
    return ({ html, ...c }) => {
        const { q } = c.req.query();

        return html(
            <Html>
                <header>
                    <h1>Hello Bun!</h1>
                </header>
                <main>
                    <HelloWorld userName="Fly.io" />
                    <HelloWorld userName={q} />
                    <hr />
                    <p>The above message can be updated by passing a value for <code>q</code> as a search parameter into the url</p>
                    <p>As an example try <code>{"?q=VALUE"}</code></p>
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
</html>`;

export const HelloWorld = ({
    userName = "Bun"
}) => html`
<hello-world user-name="${userName}">
<template shadowRootMode="open">
    <p>
        My name is <span data-target="hello-world.me">${userName}</span>!
    </p>
</template>
</hello-world>`;