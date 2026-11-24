import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.config.js";
import { PrismaClient } from "../generated/prisma/client.js"
const pool = new Pool({
  connectionString: env.database_url,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (env.node_environment !== "production") {
  globalForPrisma.prisma = prisma;
}