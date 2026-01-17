import { PrismaClient } from "@/generated/prisma";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });
  // Use 'as any' to bypass type mismatch between package versions
  const adapter = new PrismaNeon(pool as any);
  
  return new PrismaClient({ adapter });
}

// Lazy initialization
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Export as a proxy for lazy initialization
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});
