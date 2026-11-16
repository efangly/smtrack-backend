import { prisma } from "../configs";
import { Devices } from "@prisma/client";

const findConfigById = async (deviceId: string): Promise<Devices | null> => {
  try {
    const result = await prisma.devices.findUnique({
      where: { devSerial: deviceId },
      select: {
        devSerial: true,
        devDetail: true,
        devStatus: true,
        config: true,
        probe: true
      }
    });
    return result as unknown as Devices;
  } catch (error) {
    throw error;
  }
};

export {
  findConfigById
};
