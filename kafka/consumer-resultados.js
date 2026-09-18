import { Kafka } from 'kafkajs';
import { kafkaConfig, topics } from './config.js';

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'resultados-group' });

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.paymentProcessed, fromBeginning: true });
  await consumer.subscribe({ topic: topics.paymentFailed, fromBeginning: true });

  console.log(`Escuchando resultados: ${topics.paymentProcessed}, ${topics.paymentFailed}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Resultado recibido:', {
        topic,
        partition,
        payload: JSON.parse(message.value.toString()),
      });
    },
  });
}

main().catch((error) => {
  console.error('Consumer de resultados falló', error);
  process.exitCode = 1;
});
