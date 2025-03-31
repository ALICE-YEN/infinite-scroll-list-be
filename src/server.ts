import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import donationsRoutes from "./routes/donations";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const fastify = Fastify({ logger: true });

fastify.register(swagger, {
  openapi: {
    info: {
      title: "fastify-api",
      version: "1.0.0",
    },
  },
});
fastify.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

fastify.register(donationsRoutes, { prefix: "/donations" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
