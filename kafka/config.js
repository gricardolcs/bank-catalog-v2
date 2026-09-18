export const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  clientId: process.env.KAFKA_CLIENT_ID || 'bank-catalog-demo',
};

export const topics = {
  processPayment: process.env.KAFKA_TOPIC_PROCESS_PAYMENT || 'payments.card.process',
  paymentProcessed: process.env.KAFKA_TOPIC_PAYMENT_PROCESSED || 'payments.card.processed',
  paymentFailed: process.env.KAFKA_TOPIC_PAYMENT_FAILED || 'payments.card.failed',
};
