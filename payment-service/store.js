const payments = new Map();

export function createPayment(payment) {
  payments.set(payment.orderId, payment);
  return payment;
}

export function updatePayment(orderId, updates) {
  const current = payments.get(orderId);
  if (!current) {
    return null;
  }

  const next = { ...current, ...updates, updatedAt: new Date().toISOString() };
  payments.set(orderId, next);
  return next;
}

export function getPayment(orderId) {
  return payments.get(orderId) || null;
}

export function listPayments() {
  return Array.from(payments.values());
}
