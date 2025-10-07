import { buildApp } from "./app";

async function start() {
    const app = buildApp();

    const PORT = 3000;
    const HOST = '0.0.0.0';

    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);

}

start().catch((err) => {
    console.error(err);
    process.exit(1);
})