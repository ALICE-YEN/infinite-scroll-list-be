import { FastifyReply, FastifyRequest } from "fastify";
import { getDonationList } from "../services/donations.service";

export const getDonationListHandler = async (
  request: FastifyRequest<{
    Querystring: {
      type: string;
      category?: string;
      search?: string;
      page: number;
      limit: number;
    };
  }>,
  reply: FastifyReply
) => {
  const { type, category, search, page, limit } = request.query;

  if (!type) {
    return reply.status(400).send({ error: "type is required" });
  }

  const result = getDonationList({ type });
  return reply.send(result);
};
