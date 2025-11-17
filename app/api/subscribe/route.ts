import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import type { ApiResponse } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Request validation schema
const SubscribeRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  priceId: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

interface SubscribeResponse {
  checkoutUrl: string;
  sessionId: string;
}

/**
 * POST /api/subscribe
 *
 * Creates a Stripe checkout session for API subscription.
 *
 * Request Body:
 * - email: Customer email address (required)
 * - priceId: Stripe price ID (optional, uses env variable if not provided)
 * - successUrl: Redirect URL on success (optional)
 * - cancelUrl: Redirect URL on cancel (optional)
 *
 * @returns JSON response with checkout session URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = SubscribeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid request data',
        message: validationResult.error.errors.map((e) => e.message).join(', '),
      };

      return NextResponse.json(response, { status: 400 });
    }

    const { email, priceId, successUrl, cancelUrl } = validationResult.data;

    // Use provided price ID or default from environment
    const stripePriceId = priceId || process.env.STRIPE_PRICE_ID;

    if (!stripePriceId) {
      throw new Error('Stripe price ID not configured');
    }

    // Get site URL from environment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          source: 'tlv-business-pulse',
          created_at: new Date().toISOString(),
        },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${siteUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${siteUrl}/subscribe/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        email: email,
        source: 'api_subscription',
      },
      subscription_data: {
        metadata: {
          email: email,
          plan: 'api_access',
        },
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    const response: ApiResponse<SubscribeResponse> = {
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
      },
      message: 'Checkout session created successfully',
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);

    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription',
    };

    return NextResponse.json(response, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * OPTIONS /api/subscribe
 *
 * CORS preflight request handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
