import { FastifyReply, FastifyRequest } from "fastify";
import { getCategories } from "../services/categories.service";

export const getCategoriesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();

  try {
    const result = await getCategories(client);

    return reply.send(result);
  } catch (error) {
    return reply.status(500).send(error);
  } finally {
    client.release();
  }
};
