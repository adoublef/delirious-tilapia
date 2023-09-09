import { Hono } from "hono";

const result = await Bun.build({
    entrypoints: ["./client.ts"],
    target: "browser",
    // minify: true,
    format: "esm",
    splitting: true,
    sourcemap: "inline",
    minify: {
        whitespace: true,
        syntax: true,
        identifiers: false
    },
    root: import.meta.dir
});

const app = new Hono();

app.get("/", c => c.html(`
<h1>Hello, World!</h1>
<hello-world>
<template shadowRootMode="open">
    <p>My name is <span data-target="hello-world.me"></span>!</p>
</template>
</hello-world>
<script type="module" src="/client.js"></script>
`));

app.get("/client.js", async c => {
    c.header("content-type", "application/javascript");
    return c.newResponse(await (result.outputs[0]).arrayBuffer());
});

const server = (Bun.serve({ fetch: app.fetch }));

console.log(
    `Listening... http://localhost:${server.port}`
);