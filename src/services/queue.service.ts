import { Channel, connect } from "amqplib";
import dotenv from "dotenv";
import { TNewLog, TNewNotification } from "../models";
dotenv.config();

let channel: Channel;
let newChannel: Channel;
let deviceChannel: Channel;
let authChannel: Channel;

const initQueue = async () => {
  const exchangeName = "smtrack";
  const conn = await connect(String(process.env.RABBITMQ)); 
  channel = await conn.createChannel();
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  newChannel = await conn.createChannel();
  deviceChannel = await conn.createChannel();
  authChannel = await conn.createChannel();
}

const sendToQueue = async (queueName: string, payload: string): Promise<void> => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true });
  } catch (err) {
    throw err;
  }
}

const sendNewQueue = async (payload: TNewLog) => {
  try {
    await newChannel.assertQueue('log_queue', { durable: true }); 
    newChannel.sendToQueue('log_queue', Buffer.from(`{"pattern":"logday","data": ${JSON.stringify(payload)}}`), { persistent: true });
    await deviceChannel.assertQueue('log_device_queue', { durable: true });
    deviceChannel.sendToQueue('log_device_queue', Buffer.from(`{"pattern":"log-device","data": ${JSON.stringify(payload)}}`), { persistent: true });
  } catch (err) {
    throw err;
  }
}

const sendNewNotification = async (payload: TNewNotification) => {
  try {
    await newChannel.assertQueue('notification_queue', { durable: true }); 
    newChannel.sendToQueue('notification_queue', Buffer.from(`{"pattern":"notification","data": ${JSON.stringify(payload)}}`), { persistent: true });
  } catch (err) {
    throw err;
  }
}

const sendToDeviceQueue = async <T>(pattern: string, payload: T) => {
  try {
    await deviceChannel.assertQueue('log_device_queue', { durable: true }); 
    deviceChannel.sendToQueue('log_device_queue', Buffer.from(`{"pattern":"${pattern}","data": ${JSON.stringify(payload)}}`), { persistent: true });
  } catch (err) {
    throw err;
  }
}

const sendToAuthQueue = async <T>(payload: T, pattern: string) => {
  try {
    await authChannel.assertQueue('auth_queue', { durable: true }); 
    authChannel.sendToQueue('auth_queue', Buffer.from(`{"pattern":"${pattern}","data": ${JSON.stringify(payload)}}`), { persistent: true });
  } catch (err) {
    throw err;
  }
}

export { initQueue, sendToQueue, sendNewQueue, sendNewNotification, sendToDeviceQueue, sendToAuthQueue };