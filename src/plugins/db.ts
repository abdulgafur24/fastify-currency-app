import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import "reflect-metadata";
import { DataSource, Repository } from "typeorm";
import { Currency } from "../modules/currencies/entity";

declare module "fastify" {
  export interface FastifyInstance {
    db: {
      currency: Repository<Currency>;
    };
  }
}

const connector: FastifyPluginAsync = async (fastify) => {
  let connection = new DataSource({
    type: "postgres",
    url: process.env.PG_URL,
    synchronize: true,
    logging: false,
    entities: [Currency],
    migrations: [],
    subscribers: [],
  });

  await connection.initialize();
  fastify.decorate("db", {
    currency: connection.getRepository(Currency),
  });

  return Promise.resolve();
};

export default fp(connector);
