import { createServer } from "node:http";
import { createApp, createRouter, toNodeListener } from "h3";

import handler from "./handler";

const app = createApp();

const router = createRouter()
  .post(
    "/api/:id",
    handler,
  );

app.use(router);

createServer(toNodeListener(app)).listen(process.env.PORT || 3000);

// eslint-disable-next-line no-console
console.log(`http://localhost:${process.env.PORT || 3000}`);
