import { io } from 'socket.io-client';
import dotenv from "dotenv";
dotenv.config();

const URL: string = String(process.env.SOCKET_URL);
const socket = io(URL);

export { socket };