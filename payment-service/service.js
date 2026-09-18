import { commandConsumer, eventConsumer, producer, topics } from './kafka.js';
import { createPayment, getPayment, listPayments, updatePayment } from './store.js';

function buildCommand(payload) {
  return {
    orderId: payload.orderId,
    amount: payload.amount,
    currency: payload.currency,
    approve: payload.approve !== false,
    card: payload.card,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
  };
}

export async function submitPayment(payload) {
  const payment = createPayment(buildCommand(payload));

  await producer.send({
    topic: topics.processPayment,
    messages: [{ key: payment.orderId, value: JSON.stringify(payment) }],
  });

  return payment;
}

export async function startPaymentConsumers() {
  await commandConsumer.connect();
  await producer.connect();
  await eventConsumer.connect();

  await commandConsumer.subscribe({ topic: topics.processPayment, fromBeginning: false });
  await eventConsumer.subscribe({ topic: topics.paymentProcessed, fromBeginning: false });
  await eventConsumer.subscribe({ topic: topics.paymentFailed, fromBeginning: false });

  await commandConsumer.run({
    eachMessage: async ({ message }) => {
      const command = JSON.parse(message.value.toString());
      updatePayment(command.orderId, { status: 'PROCESSING' });
    },
  });

  await eventConsumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      const status = topic === topics.paymentProcessed ? 'APPROVED' : 'REJECTED';
      updatePayment(event.orderId, {
        status,
        result: event,
      });
    },
  });
}

export function findPayment(orderId) {
  return getPayment(orderId);
}

export function findAllPayments() {
  return listPayments();
}
