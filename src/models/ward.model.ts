import { z } from "zod";

export const ZWardParam = z.object({ wardId: z.string() });
export const ZWard = z.object({
  wardId: z.string().optional(),
  wardName: z.string().optional(),
  wardSeq: z.number().optional(),
  hosId: z.string().optional()
});