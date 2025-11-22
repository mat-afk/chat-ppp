import { PrismaClient } from "~~/src/generated/prisma/client";

const config = useRuntimeConfig();

const connectionString = `${config.public.databaseUrl}`;

let adapter;

if (config.public.nodeEnv === "development") {
  const { PrismaPg } = await import("@prisma/adapter-pg");
  adapter = new PrismaPg({ connectionString });
} else {
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  adapter = new PrismaNeon({ connectionString });
}

export const prisma = new PrismaClient({ adapter });
export * from "~~/src/generated/prisma/client";
