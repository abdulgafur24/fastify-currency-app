import { FastifyPluginCallback } from "fastify";

type GetCurrenciesProps = {
  Querystring: {
    skip: number;
    take: number;
  };
};

type GetCurrencyProps = {
  Params: {
    id: string;
  };
};

const currenciesHandler: FastifyPluginCallback = (server, _, next) => {
  server.get<GetCurrenciesProps>(
    "/currencies",
    {
      onRequest: [server.authenticate],
    },
    async ({ query }) => {
      const { skip, take } = query;
      const currencies = await server.db.currency.find({
        skip,
        take,
      });
      return currencies;
    }
  );
  server.get<GetCurrencyProps>(
    "/currency/:id",
    {
      onRequest: [server.authenticate],
    },
    async ({ params }) => {
      const { id } = params;
      const currency = await server.db.currency.findOneBy({
        id: parseInt(id),
      });
      return currency;
    }
  );

  next();
};

export default currenciesHandler;
