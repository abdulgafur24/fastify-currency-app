import "reflect-metadata";
import { DataSource } from "typeorm";
import { Currency } from "./modules/currencies/entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.PG_URL,
  synchronize: true,
  logging: false,
  entities: [Currency],
  migrations: [],
  subscribers: [],
});
