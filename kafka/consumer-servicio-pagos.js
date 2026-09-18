import { Kafka } from 'kafkajs';
import { kafkaConfig, topics } from './config.js';

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'servicio-pagos-group' });
const producer = kafka.producer();

function buildProcessedEvent(command) {
  return {
    transactionId: `tx-${command.orderId}`,
    orderId: command.orderId,
    amount: command.amount,
    currency: command.currency,
    status: 'APPROVED',
    card: {
      brand: command.card?.brand || 'Visa',
      lastFourDigits: command.card?.lastFourDigits || '4242',
      holderName: command.card?.holderName || 'Demo User',
    },
    processedAt: new Date().toISOString(),
  };
}

function buildFailedEvent(command) {
  return {
    transactionId: `tx-${command.orderId}`,
    orderId: command.orderId,
    amount: command.amount,
    currency: command.currency,
    errorCode: 'DECLINED_BY_ISSUER',
    errorMessage: 'La tarjeta fue rechazada para la prueba end-to-end.',
    card: {
      brand: command.card?.brand || 'Visa',
      lastFourDigits: command.card?.lastFourDigits || '4242',
    },
    failedAt: new Date().toISOString(),
  };
}

async function main() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: topics.processPayment, fromBeginning: true });

  console.log(`ServicioPagos escuchando ${topics.processPayment}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('ProcesarPago recibido:', { topic, partition, payload });

      const approved = payload.approve !== false;
      const outputTopic = approved ? topics.paymentProcessed : topics.paymentFailed;
      const outputPayload = approved ? buildProcessedEvent(payload) : buildFailedEvent(payload);

      await producer.send({
        topic: outputTopic,
        messages: [
          {
            key: payload.orderId,
            value: JSON.stringify(outputPayload),
          },
        ],
      });

      console.log(`Evento publicado en ${outputTopic}:`, outputPayload);
    },
  });
}

main().catch((error) => {
  console.error('ServicioPagos falló', error);
  process.exitCode = 1;
});
