import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out the API',
    price: 0,
    currency: 'USD',
    interval: 'month' as const,
    stripePriceId: '', // No Stripe price for free tier
    apiRateLimit: 100, // 100 requests per day
    features: [
      '100 API requests per day',
      'Basic business data',
      'Weekly updates',
      'Community support',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small projects and startups',
    price: 29,
    currency: 'USD',
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_PRICE_STARTER!,
    apiRateLimit: 5000, // 5,000 requests per day
    features: [
      '5,000 API requests per day',
      'Full business data access',
      'Daily updates',
      'Email support',
      'Historical data (3 months)',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses',
    price: 99,
    currency: 'USD',
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    apiRateLimit: 25000, // 25,000 requests per day
    features: [
      '25,000 API requests per day',
      'Full business data access',
      'Real-time updates',
      'Priority email support',
      'Historical data (1 year)',
      'Custom webhooks',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale applications',
    price: 299,
    currency: 'USD',
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    apiRateLimit: 100000, // 100,000 requests per day
    features: [
      '100,000 API requests per day',
      'Full business data access',
      'Real-time updates',
      '24/7 priority support',
      'Unlimited historical data',
      'Custom webhooks',
      'Advanced analytics',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
] as const;

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  priceId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userEmail,
    },
  });

  return session;
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}

/**
 * Get subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId: string): Promise<Stripe.Customer> {
  return await stripe.customers.retrieve(customerId) as Stripe.Customer;
}

/**
 * Construct webhook event from request
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
