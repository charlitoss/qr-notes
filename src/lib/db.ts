import { PrismaClient } from "@/generated/prisma";
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL!;
  
  // Use neon() HTTP client for serverless environments
  const sql = neon(connectionString);
  const adapter = new PrismaNeon(sql as any);
  
  return new PrismaClient({ adapter });
}

if (!globalThis.prisma) {
  globalThis.prisma = createPrismaClient();
}

export const prisma = globalThis.prisma;
