import { Kafka } from 'kafkajs';
import { kafkaConfig, topics } from '../kafka/config.js';

const kafka = new Kafka(kafkaConfig);

export const producer = kafka.producer();
export const commandConsumer = kafka.consumer({ groupId: 'payment-service-command-group' });
export const eventConsumer = kafka.consumer({ groupId: 'payment-service-event-group' });
export { topics };
