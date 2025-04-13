// controller 的責任只有：參數檢查、錯誤處理、回傳格式

import { FastifyReply, FastifyRequest } from "fastify";
import { getDonationList } from "../services/donations.service";

export const getDonationListHandler = async (
  request: FastifyRequest<{
    Querystring: {
      type: string;
      category?: number;
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

  const result = await getDonationList({
    type,
    categoryId: Number(category),
    search,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  return reply.send(result);
};
