import dotenv from "dotenv";
import { prisma, socket } from "../configs";
import { Notifications } from "@prisma/client";
import { getDateFormat } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { sendNewNotification, sendToQueue } from "./queue.service";
dotenv.config();

const addNotification = async (body: Notifications): Promise<Notifications> => {
  try {
    body.notiId = `NID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.notifications.create({
      data: body,
      include: { device: { include: { ward: { include: { hospital: true } } } } }
    });
    const pushMessage = setDetailMessage(body.notiDetail);
    if (result.device.ward.hosId === "HID-DEVELOPMENT") {
      sendToQueue("notification", JSON.stringify({topic: 'admin', title: result.device.devDetail, detail: pushMessage}));
    } else {
      sendToQueue("notification", JSON.stringify({topic: 'admin', title: result.device.devDetail, detail: pushMessage}));
      sendToQueue("notification", JSON.stringify({topic: 'service', title: result.device.devDetail, detail: pushMessage}));
      sendToQueue("notification", JSON.stringify({topic: result.device.wardId, title: result.device.devDetail, detail: pushMessage}));
      sendToQueue("notification", JSON.stringify({topic: result.device.ward.hosId, title: result.device.devDetail, detail: pushMessage}));
    }
    if (!body.notiDetail.startsWith("REPORT")) {
      sendNewNotification({
        serial: result.devSerial,
        message: body.notiDetail,
        detail: pushMessage
      });
    }
    socket.emit("send_message", {
      device: result.device.devDetail,
      message: pushMessage,
      hospital: result.device.ward.hosId,
      wardName: result.device.ward.wardName,
      hospitalName: result.device.ward.hospital.hosName,
      time: body.createAt.toString()
    });
    return result;
  } catch (error) {
    throw error;
  };
};

const setDetailMessage = (msg: string): string => {
  const msgType = msg.split("/");
  let detailMessage = "";
  switch (msgType[0]) {
    case "TEMP":
      if (msgType[1] === "OVER") {
        detailMessage = "Temperature is too high";
      } else if (msgType[1] === "LOWER") {
        detailMessage = "Temperature is too low";
      } else {
        detailMessage = "Temperature returned to normal";
      }
      break;
    case "SD":
      detailMessage = msgType[1] === "ON" ? "SDCard connected" : "SDCard failed";
      break;
    case "AC":
      detailMessage = msgType[1] === "ON" ? "Power on" : "Power off";
      break;
    case "REPORT":
      detailMessage = `Report: ${msgType[1]}`;
      break;
    default:
      if (msgType[1] === "TEMP") {
        detailMessage = `${msgType[0]}: Temperature `;
        if (msgType[2] === "OVER") {
          detailMessage += "is too high";
        } else if (msgType[2] === "LOWER") {
          detailMessage += "is too low";
        } else {
          detailMessage += "returned to normal";
        }
      } else {
        detailMessage = `${msgType[0]}: ${msgType[1]} is ${msgType[2] === "ON" ? "opened" : "closed"}`;
      }
  }
  return detailMessage;
}

export {
  addNotification
};
