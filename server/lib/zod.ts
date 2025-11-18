import z from "zod";

export const inputSchema = z.object({
  input: z.string(),
});

export const idSchema = z.object({
  id: z.string(),
});
