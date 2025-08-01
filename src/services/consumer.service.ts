import amqp from 'amqplib';
import { TNewConfig, TNewProbe } from '../models';
import { prisma } from '../configs';
import { removeCache } from '../utils';

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'legacy_queue';
type MessageContent = {
  pattern: string;
  data: {
    id: string;
    data: any;
  };
}

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ || RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`Waiting for messages in ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString()) as MessageContent;
        switch (content.pattern) {
          case 'probe':
            const probeData = content.data.data as TNewProbe;
            await prisma.devices.update({
              where: { devSerial: content.data.id },
              data: {
                probe: {
                  updateMany: {
                    where: { devSerial: content.data.id },
                    data: {
                      probeType: probeData.type,
                      probeName: probeData.name,
                      probeCh: probeData.channel,
                      tempMin: probeData.tempMin,
                      tempMax: probeData.tempMax,
                      humMin: probeData.humiMin,
                      humMax: probeData.humiMax,
                      adjustTemp: probeData.tempAdj,
                      adjustHum: probeData.humiAdj,
                      delayTime: probeData.stampTime,
                      door: probeData.doorQty,
                      location: probeData.position,
                    }
                  }
                },
                config: {
                  update: {
                    where: { devSerial: content.data.id },
                    data: {
                      notiTime: probeData.notiDelay,
                      backToNormal: probeData.notiToNormal ? "1" : "0",
                      mobileNoti: probeData.notiMobile ? "1" : "0",
                      repeat: probeData.notiRepeat,
                      firstDay: probeData.firstDay,
                      secondDay: probeData.secondDay,
                      thirdDay: probeData.thirdDay,
                      firstTime: probeData.firstTime,
                      secondTime: probeData.secondTime,
                      thirdTime: probeData.thirdTime,
                    }
                  }
                }
              }
            });
            break;
          case 'config':
            const configData = content.data.data as TNewConfig; // Assuming config data is structured
            await prisma.configs.update({
              where: { devSerial: content.data.id },
              data: {
                mode: configData.dhcp ? "1" : "0",
                modeEth: configData.dhcpEth ? "1" : "0",
                ip: configData.ip,
                macAddWiFi: configData.mac,
                subNet: configData.subnet,
                getway: configData.gateway,
                dns: configData.dns,
                ipEth: configData.ipEth,
                macAddEth: configData.macEth,
                subNetEth: configData.subnetEth,
                getwayEth: configData.gatewayEth,
                dnsEth: configData.dnsEth,
                ssid: configData.ssid,
                ssidPass: configData.password,
                sim: configData.simSP,
                email1: configData.email1,
                email2: configData.email2,
                email3: configData.email3,
                hardReset: configData.hardReset,
              }
            });
            break;
        }
        removeCache("device");
        removeCache("config");
        removeCache("probe");
        channel.ack(msg); // ACK ถ้าสำเร็จ
      } catch (error) {
        console.error('Error handling message:', error);
        channel.nack(msg, false, false); // NACK + discard
      }
    }
  });
}

export { connectRabbitMQ }