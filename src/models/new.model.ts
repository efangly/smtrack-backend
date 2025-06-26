import { z } from "zod";

export const ZNewDevice = z.object({
  id: z.string().optional(),
  ward: z.string().optional(),
  wardName: z.string().optional(),
  hospital: z.string().optional(),
  hospitalName: z.string().optional(),
  staticName: z.string().optional(),
  name: z.string().optional(),
  status: z.boolean().optional(),
  seq: z.number().optional(),
  location: z.string().optional(),
  position: z.string().optional(),
  positionPic: z.string().optional(),
  installDate: z.date().optional(),
  firmware: z.string().optional(),
  remark: z.string().optional(),
  online: z.boolean().optional(),
  tag: z.string().optional(),
  token: z.string().optional()
});

export const ZNewConfig = z.object({
  id: z.string().optional(),
  sn: z.string().optional(),
  dhcp: z.boolean().default(true),
  ip: z.string().optional(),
  mac: z.string().optional(),
  subnet: z.string().optional(),
  gateway: z.string().optional(),
  dns: z.string().optional(),
  dhcpEth: z.boolean().default(true),
  ipEth: z.string().optional(),
  macEth: z.string().optional(),
  subnetEth: z.string().optional(),
  gatewayEth: z.string().optional(),
  dnsEth: z.string().optional(),
  ssid: z.string().default("RDE3_2.4GHz"),
  password: z.string().default("rde05012566"),
  simSP: z.string().optional(),
  email1: z.string().optional(),
  email2: z.string().optional(),
  email3: z.string().optional(),
  hardReset: z.string().default("0200"),
});

export const ZNewProbe = z.object({
  id: z.string().optional(),
  sn: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  channel: z.string().default("1"),
  tempMin: z.number().default(0.00),
  tempMax: z.number().default(0.00),
  humiMin: z.number().default(0.00),
  humiMax: z.number().default(0.00),
  tempAdj: z.number().default(0.00),
  humiAdj: z.number().default(0.00),
  stampTime: z.string().optional(),
  doorQty: z.number().default(1),
  position: z.string().nullable(),
  muteAlarmDuration: z.string().optional(),
  doorSound: z.boolean().optional(),
  doorAlarmTime: z.string().optional(),
  muteDoorAlarmDuration: z.string().optional(),
  notiDelay: z.number().optional(), // ดีเลการส่งแจ้งเตือน 0 คือส่งทันที
  notiToNormal: z.boolean().optional(), // ส่งแจ้งเตือนหลังอุณหภูมิกลับมาปกติ
  notiMobile: z.boolean().optional(), // เปิดปิดการแจ้งเตือน
  notiRepeat: z.number().optional(), // ตั้งค่าการส่งซ้ำ ค่าเริ่มต้นคือ 1
  firstDay: z.string().default("OFF"),
  secondDay: z.string().default("OFF"),
  thirdDay: z.string().default("OFF"),
  firstTime: z.string().default("0000"),
  secondTime: z.string().default("0000"),
  thirdTime: z.string().default("0000")
});

export type TNewDevice = z.infer<typeof ZNewDevice>;
export type TNewConfig = z.infer<typeof ZNewConfig>;
export type TNewProbe = z.infer<typeof ZNewProbe>;