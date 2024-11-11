import { z } from "zod";

export const ZHospitalParam = z.object({ hosId: z.string() });
export const ZHospital = z.object({
  hosId: z.string().optional(),
  hosName: z.string().optional(),
  hosAddress: z.string().optional(),
  hosTelephone: z.string().optional(),
  userContact: z.string().optional(),
  userTelePhone: z.string().optional(),
  hosLatitude: z.string().optional(),
  hosLongitude: z.string().optional(),
  hosPic: z.string().optional(),
});