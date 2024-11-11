import { z } from "zod";

export const ZWarrantyParam = z.object({ warrId: z.string() });
export const ZWarranty = z.object({
  warrId: z.string().optional(),
  devName: z.string().optional(),
  productName: z.string().optional(),
  productModel: z.string().optional(),
  installDate: z.string().optional(),
  customerName: z.string().optional(),
  customerAddress: z.string().optional(),
  saleDept: z.string().optional(),
  invoice: z.string().optional(),
  expire: z.string().optional(),
  warrStatus: z.boolean().optional(),
});