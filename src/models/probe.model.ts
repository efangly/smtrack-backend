import { z } from "zod";

export const ZProbeParam = z.object({ probeId: z.string() });
export const ZProbe = z.object({
  probeId: z.string().optional(),
  probeName: z.string().optional(),
  probeType: z.string().optional(),
  probeCh: z.string().optional(),
  tempMin: z.number().optional(),
  tempMax: z.number().optional(),
  humMin: z.number().optional(),
  humMax: z.number().optional(),
  adjustTemp: z.number().optional(),
  adjustHum: z.number().optional(),
  delayTime: z.string().optional(),
  door: z.number().optional(),
  location: z.string().optional(),
  devSerial: z.string().optional()
});