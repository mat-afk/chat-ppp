import z from "zod";

export const inputSchema = z.object({
  input: z.string(),
});

export const idSchema = z.object({
  id: z.string(),
});

export const sessionTokenSchema = z.object({
  sessionToken: z.string().optional(),
});

export const keySchema = z.object({
  key: z.string(),
});
