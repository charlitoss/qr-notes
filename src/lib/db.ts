import { PrismaClient } from "@/generated/prisma";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  // Log to verify the env var
  console.log("=== DB INIT ===");
  console.log("DATABASE_URL exists:", !!connectionString);
  console.log("DATABASE_URL value:", connectionString?.substring(0, 40) + "...");
  console.log("===============");
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  
  return new PrismaClient({ adapter });
}

// Only create on first import
if (!globalThis.prisma) {
  globalThis.prisma = createPrismaClient();
}

export const prisma = globalThis.prisma;
