import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { handleIndex, serveBundle, streamAudio } from "./http";

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

app.get("/", handleIndex());
app.get("/client.js", serveBundle(result.outputs[0]));
app.get("/samples/:filename", streamAudio())

const server = (Bun.serve({ fetch: app.fetch }));

console.log(
    `Listening... http://localhost:${server.port}`
);