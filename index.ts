import { Hono } from "hono";

const result = await Bun.build({
    entrypoints: ["./client.ts"],
    minify: true,
});

const app = new Hono();

app.get("/", c => c.html(
    `<h1>Hello, World!</h1>
        <script src="/client.js"></script>`
));

app.get("/client.js", async c => {
    return c.newResponse(await (result.outputs[0]).arrayBuffer());
});

const server = (Bun.serve({ fetch: app.fetch }));

console.log(
    `Listening... http://localhost:${server.port}`
);