import { Handler } from "hono";
import { html } from "hono/html";
import { HtmlEscapedString } from "hono/utils/html";

export function handleIndex(): Handler {
    return ({ html, ...c }) => {
        return html(
            <Html>
                <header>
                    <h1>Hello Bun!</h1>
                </header>
                <main>
                    <hello-world>
                        <template shadowRootMode="open">
                            <p>
                                My name is <span data-target="hello-world.me"></span>!
                            </p>
                        </template>
                    </hello-world>
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

/*
c => c.html(`
<h1>Hello, World!</h1>
<hello-world>
<template shadowRootMode="open">
    <p>My name is <span data-target="hello-world.me"></span>!</p>
</template>
</hello-world>
<script type="module" src="/client.js"></script>
`)
*/
