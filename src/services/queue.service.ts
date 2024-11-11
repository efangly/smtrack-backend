import { Channel, connect } from "amqplib";
import dotenv from "dotenv";
dotenv.config();

let channel: Channel;

const initQueue = async () => {
  const exchangeName = "smtrack";
  const conn = await connect(String(process.env.RABBITMQ)); 
  channel = await conn.createChannel();
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
}

const sendToQueue = async (queueName: string, payload: string): Promise<void> => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true });
  } catch (err) {
    throw err;
  }
}

export { initQueue, sendToQueue }