import { z } from "zod";

export const ZNotiParam = z.object({ notiId: z.string() });
export const ZNoti = z.object({
  notiId: z.string().optional(),
  devSerial: z.string().optional(),
  notiDetail: z.string().optional(),
  notiStatus: z.boolean().optional(),
});