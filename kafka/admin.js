import { Kafka } from 'kafkajs';
import { kafkaConfig, topics } from './config.js';

const kafka = new Kafka(kafkaConfig);
const admin = kafka.admin();

async function main() {
  await admin.connect();
  await admin.createTopics({
    waitForLeaders: true,
    topics: Object.values(topics).map((topic) => ({ topic })),
  });
  console.log('Topics ready:', topics);
  await admin.disconnect();
}

main().catch((error) => {
  console.error('Failed to create topics', error);
  process.exitCode = 1;
});
