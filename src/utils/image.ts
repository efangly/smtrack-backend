import { prisma } from "../configs";

const getUserImage = async (id: string): Promise<string | null | undefined> => {
  try {
    const image = await prisma.users.findUnique({
      where: {
        userId: id
      }
    });
    return image?.userPic;
  } catch (error) {
    throw error;
  }
}

const getHospitalImage = async (id: string): Promise<string | null | undefined> => {
  try {
    const image = await prisma.hospitals.findUnique({
      where: {
        hosId: id
      }
    });
    return image?.hosPic;
  } catch (error) {
    throw error;
  }
}

const getDeviceImage = async (id: string): Promise<string | null | undefined> => {
  try {
    const image = await prisma.devices.findUnique({
      where: {
        devId: id
      }
    });
    return image?.locPic;
  } catch (error) {
    throw error;
  }
}

export {
  getUserImage,
  getHospitalImage,
  getDeviceImage
}

