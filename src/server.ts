import fastify, { FastifyInstance } from "fastify";

import db from "./plugins/db";
import auth from "./plugins/auth";
import currenciesHandler from "./modules/currencies/routes";

function createServer(): FastifyInstance {
  const server = fastify();

  server.register(auth);
  server.register(db);
  server.register(currenciesHandler);

  server.setErrorHandler((error, req, res) => {
    req.log.error(error.toString());
    res.send({ error });
  });

  return server;
}

export default createServer;
