import { RedisClientType, createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

let redisConn: RedisClientType;

const initRedis = async (): Promise<RedisClientType> => {
  redisConn = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
  });
  await redisConn.connect();
  await redisConn.flushAll();
  redisConn.on('error', (error) => {
    console.log('Redis client', error);
    setTimeout(() => { 
      console.log('Redis client reconnect...');
      initRedis(); 
    }, 5000);
  });
  console.log('Redis client connected');
  return redisConn;
}

export {
  initRedis,
  redisConn
}