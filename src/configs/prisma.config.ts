import { PrismaClient } from "@prisma/client";
import { readReplicas } from '@prisma/extension-read-replicas';

export const prisma = new PrismaClient().$extends(
  readReplicas({
    url: String(process.env.DATABASE_URL_REPLICATE),
  })
);