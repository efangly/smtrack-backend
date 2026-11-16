import { z } from "zod";

export const ZConfigParam = z.object({ devSerial: z.string() });
