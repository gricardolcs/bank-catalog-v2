import { Kafka } from 'kafkajs';
import { kafkaConfig, topics } from './config.js';

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();

const approve = process.argv[2] !== 'fail';

const command = {
  orderId: `ord-${Date.now()}`,
  amount: 149.99,
  currency: 'USD',
  approve,
  card: {
    brand: 'Visa',
    lastFourDigits: '4242',
    holderName: 'Juan Perez',
  },
};

async function main() {
  await producer.connect();
  await producer.send({
    topic: topics.processPayment,
    messages: [
      {
        key: command.orderId,
        value: JSON.stringify(command),
      },
    ],
  });
  console.log(`ProcesarPago enviado a ${topics.processPayment}:`, command);
  await producer.disconnect();
}

main().catch((error) => {
  console.error('No se pudo enviar ProcesarPago', error);
  process.exitCode = 1;
});
