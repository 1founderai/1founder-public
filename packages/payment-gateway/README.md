# @1founder/payment-gateway

> Multi-gateway payment abstraction for Indian SaaS — Razorpay + Stripe + Dodo Payments.

Built for products that need to accept payments from Indian users (UPI, cards, net banking via Razorpay) and international users (Stripe), with an optional third gateway (Dodo) for redundancy or specific use cases.

Extracted from production at [1founder.ai](https://1founder.ai).

---

## Why this exists

Indian SaaS products typically need:
- **Razorpay** for Indian users (UPI, rupee subscriptions, net banking)
- **Stripe** for international users (cards, global subscriptions)
- Idempotent webhook handling across both
- A unified credit/subscription model that works across gateways

Building this three times (once per gateway) is painful. This package gives you a unified interface.

---

## Installation

```bash
npm install @1founder/payment-gateway
```

---

## Quick Start

```typescript
import { PaymentGateway } from '@1founder/payment-gateway';

const gateway = new PaymentGateway({
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  dodo: {
    webhookSecret: process.env.DODO_WEBHOOK_SECRET,
  },
});

// Create a one-time payment order (Razorpay)
const order = await gateway.createOrder({
  gateway: 'razorpay',
  amount: 9900,        // in paise (₹99)
  currency: 'INR',
  notes: {
    userId: 'user_abc',
    productId: 'credits_99',
    credits: '10',
  },
});

// Verify payment signature after frontend completion
const verified = await gateway.verifyPayment({
  gateway: 'razorpay',
  paymentId: req.body.razorpay_payment_id,
  orderId: req.body.razorpay_order_id,
  signature: req.body.razorpay_signature,
});

// Handle webhook — unified interface across all gateways
app.post('/webhooks/:gateway', express.raw({ type: '*/*' }), async (req, res) => {
  const event = await gateway.parseWebhook({
    gateway: req.params.gateway as 'razorpay' | 'stripe' | 'dodo',
    body: req.body,
    signature: req.headers['x-razorpay-signature'] as string
                || req.headers['stripe-signature'] as string
                || req.headers['webhook-signature'] as string,
  });

  if (event.type === 'payment.captured' || event.type === 'payment_intent.succeeded') {
    // Unified event — handle once regardless of gateway
    await fulfillPayment({
      userId: event.metadata.userId,
      amount: event.amount,
      currency: event.currency,
      gatewayPaymentId: event.paymentId,
      gateway: event.gateway,
    });
  }

  res.json({ received: true });
});
```

---

## API Reference

### `PaymentGateway`

#### `createOrder(options)`

Creates a payment order. Returns gateway-specific order data to pass to the frontend SDK.

```typescript
interface CreateOrderOptions {
  gateway: 'razorpay' | 'stripe';
  amount: number;          // In smallest currency unit (paise for INR, cents for USD)
  currency: string;        // 'INR', 'USD', 'EUR', etc.
  notes?: Record<string, string>;  // Passed through webhook — use for userId, productId etc.
  description?: string;
}
```

#### `verifyPayment(options)`

Verifies a payment signature after the user completes payment on the frontend.

```typescript
interface VerifyPaymentOptions {
  gateway: 'razorpay' | 'stripe';
  paymentId: string;
  orderId?: string;        // Razorpay: order_id. Stripe: not needed.
  subscriptionId?: string; // Razorpay subscriptions only
  signature: string;
}

// Returns: { verified: boolean }
```

#### `parseWebhook(options)`

Parses and verifies a webhook payload from any supported gateway. Returns a unified `PaymentEvent`.

```typescript
interface ParseWebhookOptions {
  gateway: 'razorpay' | 'stripe' | 'dodo';
  body: Buffer | string;   // Use express.raw() middleware — do NOT use express.json()
  signature: string;
}

interface PaymentEvent {
  type: string;            // Normalised: 'payment.captured', 'subscription.created', etc.
  gateway: string;
  paymentId: string;
  amount: number;
  currency: string;
  metadata: Record<string, string>;  // Notes/metadata from order creation
  raw: unknown;            // Original gateway event for edge cases
}
```

#### `createSubscription(options)`

Creates a recurring subscription. Returns subscription data including the subscription ID.

```typescript
interface CreateSubscriptionOptions {
  gateway: 'razorpay' | 'stripe';
  planId: string;          // Gateway plan/price ID
  customerId?: string;     // Stripe customer ID (required for Stripe)
  totalCount?: number;     // Razorpay: number of billing cycles (12 = annual)
  notes?: Record<string, string>;
}
```

---

## Webhook Setup

### Critical: Buffer body for webhooks

All three gateways require the raw request body (Buffer) for signature verification. **Do not use `express.json()` on webhook routes.**

```typescript
// CORRECT — use express.raw() for webhook routes
app.use('/webhooks/razorpay', express.raw({ type: 'application/json' }));
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/webhooks/dodo', express.raw({ type: 'application/json' }));

// CORRECT — use express.json() for all other routes
app.use(express.json());
```

### Idempotency

Webhooks retry on failure. Always check if you've already processed a payment before fulfilling:

```typescript
const existing = await db.creditPurchases.findOne({
  where: { razorpayPaymentId: event.paymentId },
});
if (existing) {
  res.json({ received: true }); // Already processed
  return;
}

// Process and record atomically
await db.creditPurchases.insert({
  razorpayPaymentId: event.paymentId,
  status: 'success',
  // ... other fields
});
await fulfillCredits(userId, credits);
```

Add a unique index on `razorpay_payment_id` and `stripe_payment_id` to enforce idempotency at the database level.

---

## Gateway-Specific Notes

### Razorpay

- Webhook body arrives as **Buffer** — `Buffer.isBuffer(body)` check required, then `JSON.parse(body.toString())`
- Signature: `HMAC-SHA256(orderId + '|' + paymentId, webhookSecret)`
- For subscriptions: signature is `HMAC-SHA256(subscriptionId + '|' + paymentId, webhookSecret)`
- UPI payments complete asynchronously — always use webhooks, not just frontend callback

### Stripe

- Use `stripe.webhooks.constructEvent(body, signature, webhookSecret)` — do not roll your own
- Customer object required for subscription creation — create customer first if not exists
- `payment_intent.succeeded` is the canonical success event for one-time payments

### Dodo Payments

- Signature verification: `HMAC-SHA256(body, webhookSecret)` — compare as hex
- **`ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` fix**: Dodo may send signatures in non-standard formats. Always compare buffer lengths before `crypto.timingSafeEqual()`, fall back to direct string comparison if lengths differ:

```typescript
const expectedBuf = Buffer.from(expectedSig, 'hex');
const receivedBuf = Buffer.from(receivedSig, 'hex');

const isValid = expectedBuf.length === receivedBuf.length
  ? crypto.timingSafeEqual(expectedBuf, receivedBuf)
  : expectedSig === receivedSig;  // Length mismatch fallback
```

---

## Environment Variables

```bash
# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Dodo (optional)
DODO_WEBHOOK_SECRET=xxx
```

---

## License

MIT — use freely in commercial projects.

Built by [1Founder](https://1founder.ai).
