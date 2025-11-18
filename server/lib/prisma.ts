import { PrismaClient } from "../../src/generated/prisma/client";

export const prisma = new PrismaClient();
export * from "../../src/generated/prisma/client";
