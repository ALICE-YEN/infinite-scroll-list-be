import { FastifyInstance } from "fastify";
import { getDonationListSchema } from "../schemas/donations.schema";
import { getDonationListHandler } from "../controllers/donations.controller";

// 利用 Fastify 的路由選項來定義 schema，讓 Fastify 自動驗證請求參數與產生 Swagger 文件（藉由 fastify-swagger 插件）
async function donationRoutes(fastify: FastifyInstance) {
  fastify.get("/", { schema: getDonationListSchema }, getDonationListHandler);
}

export default donationRoutes;
