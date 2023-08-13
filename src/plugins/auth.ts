import {
  FastifyPluginCallback,
  RouteHandler,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: {
      id: number;
      name: string;
      age: number;
    };
  }
}

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: RouteHandler;
  }
}

const auth: FastifyPluginCallback = async (server, _, next) => {
  server.register(require("@fastify/jwt"), {
    secret: "supersecret",
  });
  server.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  next();
};

export default fp(auth);
