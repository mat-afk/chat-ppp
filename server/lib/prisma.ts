import { PrismaClient } from "~~/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";

const config = useRuntimeConfig();

const connectionString = `${config.public.databaseUrl}`;

const adapter =
  config.public.nodeEnv === "development"
    ? new PrismaPg({ connectionString })
    : new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter });
export * from "~~/src/generated/prisma/client";
