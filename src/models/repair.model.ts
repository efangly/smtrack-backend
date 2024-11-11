import { z } from "zod";

export const ZRepairParam = z.object({ repairId: z.string() });
export const ZRepair = z.object({
  probeId: z.string().optional(),
  repairId: z.string().optional(),
  devId: z.string().optional(),
  repairInfo: z.string().optional(),
  repairInfo1: z.string().optional(),
  repairInfo2: z.string().optional(),
  repairLocation: z.string().optional(),
  ward: z.string().optional(),
  repairDetails: z.string().optional(),
  telePhone: z.string().optional(),
  repairStatus: z.string().optional(),
  warrantyStatus: z.string().optional(),
  comment: z.string().optional(),
  baseStatus: z.string().optional()
});