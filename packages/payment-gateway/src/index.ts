import crypto from 'crypto';

// ── Types ────────────────────────────────────────────────────────────────────

export type Gateway = 'razorpay' | 'stripe' | 'dodo';

export interface PaymentGatewayConfig {
  razorpay?: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  stripe?: {
    secretKey: string;
    webhookSecret: string;
  };
  dodo?: {
    webhookSecret?: string;
  };
}

export interface CreateOrderOptions {
  gateway: 'razorpay' | 'stripe';
  amount: number;
  currency: string;
  notes?: Record<string, string>;
  description?: string;
}

export interface VerifyPaymentOptions {
  gateway: 'razorpay' | 'stripe';
  paymentId: string;
  orderId?: string;
  subscriptionId?: string;
  signature: string;
}

export interface ParseWebhookOptions {
  gateway: Gateway;
  body: Buffer | string;
  signature: string;
}

export interface PaymentEvent {
  type: string;
  gateway: Gateway;
  paymentId: string;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
  raw: unknown;
}

export interface CreateSubscriptionOptions {
  gateway: 'razorpay' | 'stripe';
  planId: string;
  customerId?: string;
  totalCount?: number;
  notes?: Record<string, string>;
}

// ── PaymentGateway class ──────────────────────────────────────────────────────

export class PaymentGateway {
  private config: PaymentGatewayConfig;
  private razorpay: any;
  private stripe: any;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;

    if (config.razorpay) {
      try {
        const Razorpay = require('razorpay');
        this.razorpay = new Razorpay({
          key_id: config.razorpay.keyId,
          key_secret: config.razorpay.keySecret,
        });
      } catch {
        // razorpay package not installed — will throw on use
      }
    }

    if (config.stripe) {
      try {
        const Stripe = require('stripe');
        this.stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2024-06-20' });
      } catch {
        // stripe package not installed — will throw on use
      }
    }
  }

  // ── Create order ────────────────────────────────────────────────────────────

  async createOrder(options: CreateOrderOptions): Promise<any> {
    if (options.gateway === 'razorpay') {
      this.assertRazorpay();
      return this.razorpay.orders.create({
        amount: options.amount,
        currency: options.currency,
        notes: options.notes || {},
      });
    }

    if (options.gateway === 'stripe') {
      this.assertStripe();
      return this.stripe.paymentIntents.create({
        amount: options.amount,
        currency: options.currency.toLowerCase(),
        metadata: options.notes || {},
        description: options.description,
        automatic_payment_methods: { enabled: true },
      });
    }

    throw new Error(`Unsupported gateway: ${options.gateway}`);
  }

  // ── Verify payment ──────────────────────────────────────────────────────────

  async verifyPayment(options: VerifyPaymentOptions): Promise<{ verified: boolean }> {
    if (options.gateway === 'razorpay') {
      this.assertRazorpayConfig();
      const source = options.orderId
        ? `${options.orderId}|${options.paymentId}`
        : `${options.subscriptionId}|${options.paymentId}`;

      const expected = crypto
        .createHmac('sha256', this.config.razorpay!.keySecret)
        .update(source)
        .digest('hex');

      return { verified: expected === options.signature };
    }

    if (options.gateway === 'stripe') {
      // Stripe payment intents are verified server-side via webhook
      // Frontend just passes the paymentIntentId — retrieve and check status
      this.assertStripe();
      const intent = await this.stripe.paymentIntents.retrieve(options.paymentId);
      return { verified: intent.status === 'succeeded' };
    }

    throw new Error(`Unsupported gateway: ${options.gateway}`);
  }

  // ── Parse webhook ───────────────────────────────────────────────────────────

  async parseWebhook(options: ParseWebhookOptions): Promise<PaymentEvent> {
    // Ensure body is a string for JSON parsing
    const bodyStr = Buffer.isBuffer(options.body)
      ? options.body.toString('utf-8')
      : options.body;

    if (options.gateway === 'razorpay') {
      return this.parseRazorpayWebhook(bodyStr, options.signature);
    }

    if (options.gateway === 'stripe') {
      return this.parseStripeWebhook(options.body, options.signature);
    }

    if (options.gateway === 'dodo') {
      return this.parseDodoWebhook(bodyStr, options.signature);
    }

    throw new Error(`Unsupported gateway: ${options.gateway}`);
  }

  // ── Create subscription ─────────────────────────────────────────────────────

  async createSubscription(options: CreateSubscriptionOptions): Promise<any> {
    if (options.gateway === 'razorpay') {
      this.assertRazorpay();
      return this.razorpay.subscriptions.create({
        plan_id: options.planId,
        total_count: options.totalCount || 12,
        notes: options.notes || {},
      });
    }

    if (options.gateway === 'stripe') {
      this.assertStripe();
      if (!options.customerId) throw new Error('Stripe subscriptions require a customerId');
      return this.stripe.subscriptions.create({
        customer: options.customerId,
        items: [{ price: options.planId }],
        metadata: options.notes || {},
      });
    }

    throw new Error(`Unsupported gateway: ${options.gateway}`);
  }

  // ── Private: Razorpay webhook ───────────────────────────────────────────────

  private parseRazorpayWebhook(bodyStr: string, signature: string): PaymentEvent {
    this.assertRazorpayConfig();

    const expected = crypto
      .createHmac('sha256', this.config.razorpay!.webhookSecret)
      .update(bodyStr)
      .digest('hex');

    if (expected !== signature) {
      throw new Error('Razorpay webhook signature invalid');
    }

    const payload = JSON.parse(bodyStr);
    const event = payload.event as string;
    const entity = payload.payload?.payment?.entity
      || payload.payload?.subscription?.entity
      || {};

    return {
      type: event,
      gateway: 'razorpay',
      paymentId: entity.id || '',
      amount: entity.amount || 0,
      currency: entity.currency || 'INR',
      metadata: entity.notes || {},
      raw: payload,
    };
  }

  // ── Private: Stripe webhook ─────────────────────────────────────────────────

  private parseStripeWebhook(body: Buffer | string, signature: string): PaymentEvent {
    this.assertStripe();
    this.assertStripeConfig();

    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.config.stripe!.webhookSecret
    );

    const obj = event.data.object as any;

    return {
      type: event.type,
      gateway: 'stripe',
      paymentId: obj.id || '',
      amount: obj.amount || obj.amount_total || 0,
      currency: obj.currency || 'usd',
      metadata: obj.metadata || {},
      raw: event,
    };
  }

  // ── Private: Dodo webhook ───────────────────────────────────────────────────

  private parseDodoWebhook(bodyStr: string, signature: string): PaymentEvent {
    if (this.config.dodo?.webhookSecret) {
      const cleanSig = signature.replace(/^sha256=/, '');
      const expectedSig = crypto
        .createHmac('sha256', this.config.dodo.webhookSecret)
        .update(bodyStr)
        .digest('hex');

      // ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH guard
      // Dodo may send signatures in non-standard formats
      const expectedBuf = Buffer.from(expectedSig, 'hex');
      const receivedBuf = Buffer.from(cleanSig, 'hex');

      const isValid = expectedBuf.length === receivedBuf.length
        ? crypto.timingSafeEqual(expectedBuf, receivedBuf)
        : expectedSig === cleanSig;

      if (!isValid) {
        throw new Error('Dodo webhook signature invalid');
      }
    }

    const payload = JSON.parse(bodyStr);

    return {
      type: payload.type || payload.event_type || 'payment.captured',
      gateway: 'dodo',
      paymentId: payload.data?.payment_id || payload.payment_id || '',
      amount: payload.data?.amount || 0,
      currency: payload.data?.currency || 'USD',
      metadata: payload.data?.metadata || {},
      raw: payload,
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private assertRazorpay() {
    if (!this.razorpay) throw new Error('Razorpay not initialised — provide razorpay config');
  }

  private assertRazorpayConfig() {
    if (!this.config.razorpay) throw new Error('Razorpay config not provided');
  }

  private assertStripe() {
    if (!this.stripe) throw new Error('Stripe not initialised — provide stripe config');
  }

  private assertStripeConfig() {
    if (!this.config.stripe) throw new Error('Stripe config not provided');
  }
}

// ── Utility: safe webhook body middleware ─────────────────────────────────────

/**
 * Express middleware that ensures webhook routes receive raw Buffer body.
 * Must be applied BEFORE express.json() in your middleware stack.
 *
 * Usage:
 *   app.use('/webhooks/razorpay', rawBody);
 *   app.use('/webhooks/stripe', rawBody);
 *   app.use('/webhooks/dodo', rawBody);
 *   app.use(express.json()); // after webhook routes
 */
export function rawBody(req: any, res: any, next: any) {
  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    req.body = Buffer.concat(chunks);
    next();
  });
  req.on('error', next);
}

export default PaymentGateway;
