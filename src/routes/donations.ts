import { FastifyInstance } from "fastify";
import { getDonationListHandler } from "../controllers/donations.controller";

async function donationRoutes(fastify: FastifyInstance) {
  fastify.get("/", getDonationListHandler);
}

export default donationRoutes;
