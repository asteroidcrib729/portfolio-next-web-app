import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { withExplicitVerifiedTls } from "@/lib/postgresConnection";

const globalForPrisma = globalThis as typeof globalThis & {
  portfolioPrisma?: PrismaClient;
};

let prisma: PrismaClient | undefined;

export function hasDatabaseConfiguration() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPrisma() {
  if (prisma) return prisma;
  if (globalForPrisma.portfolioPrisma) return globalForPrisma.portfolioPrisma;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured for this deployment.");
  }

  const adapter = new PrismaPg({
    connectionString: withExplicitVerifiedTls(connectionString),
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    max: 5,
    query_timeout: 15_000,
  });
  prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.portfolioPrisma = prisma;
  }

  return prisma;
}
