import { FastifyInstance } from "fastify";
import { getCategoriesSchema } from "../schemas/categories.schema";
import { getCategoriesHandler } from "../controllers/categories.controller";

async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get("/", { schema: getCategoriesSchema }, getCategoriesHandler);
}

export default categoriesRoutes;
