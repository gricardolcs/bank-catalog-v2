import express from 'express';
import { findAllPayments, findPayment, startPaymentConsumers, submitPayment } from './service.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/payments', (_req, res) => {
  res.json(findAllPayments());
});

app.get('/payments/:orderId', (req, res) => {
  const payment = findPayment(req.params.orderId);
  if (!payment) {
    res.status(404).json({ message: 'Payment not found' });
    return;
  }

  res.json(payment);
});

app.post('/payments', async (req, res, next) => {
  try {
    const { orderId, amount, currency, approve, card } = req.body;

    if (!orderId || typeof amount !== 'number' || !currency) {
      res.status(400).json({ message: 'orderId, amount and currency are required' });
      return;
    }

    const payment = await submitPayment({ orderId, amount, currency, approve, card });
    res.status(202).json(payment);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error('Payment service error', error);
  res.status(500).json({ message: 'Internal server error' });
});

startPaymentConsumers()
  .then(() => {
    app.listen(port, () => {
      console.log(`Payment service listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start payment service', error);
    process.exitCode = 1;
  });
