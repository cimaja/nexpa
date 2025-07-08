import { AfterChangeHook, BeforeChangeHook } from '../types';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create a payment intent when an order is created
export const createPaymentIntent: AfterChangeHook = async ({ doc, operation, req }) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    req.payload.logger.warn('Stripe secret key not found. Skipping payment intent creation.');
    return;
  }

  // Only create payment intent for new orders
  if (operation !== 'create' || doc.stripePaymentIntentID) {
    return;
  }

  try {
    // Get customer's Stripe ID
    let stripeCustomerID = null;
    if (doc.customer) {
      const customer = await req.payload.findByID({
        collection: 'customers',
        id: doc.customer,
      });
      
      stripeCustomerID = customer.stripeCustomerID;
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(doc.total * 100), // Convert to cents
      currency: 'eur',
      customer: stripeCustomerID,
      metadata: {
        orderID: doc.id,
        orderNumber: doc.orderNumber,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: {
        stripePaymentIntentID: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });

    req.payload.logger.info(`Payment intent created for order ${doc.id}: ${paymentIntent.id}`);
  } catch (error) {
    req.payload.logger.error(`Error creating payment intent: ${error}`);
  }
};

// Update payment intent when order is updated
export const updatePaymentIntent: BeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (!process.env.STRIPE_SECRET_KEY || !originalDoc.stripePaymentIntentID) {
    return data;
  }

  // Only update if total has changed
  if (data.total === originalDoc.total) {
    return data;
  }

  try {
    // Update payment intent amount
    await stripe.paymentIntents.update(originalDoc.stripePaymentIntentID, {
      amount: Math.round(data.total * 100), // Convert to cents
    });

    req.payload.logger.info(`Payment intent ${originalDoc.stripePaymentIntentID} updated for order ${originalDoc.id}`);
  } catch (error) {
    req.payload.logger.error(`Error updating payment intent: ${error}`);
  }

  return data;
};

// Handle webhook events from Stripe
export const handleStripeWebhook = async (req: any, res: any) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    req.payload.logger.warn('Stripe webhook secret not found.');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    req.payload.logger.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent, req.payload);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment, req.payload);
      break;
    default:
      // Unexpected event type
      req.payload.logger.info(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
};

// Helper function to handle successful payments
async function handleSuccessfulPayment(paymentIntent: any, payload: any) {
  const { orderID } = paymentIntent.metadata;

  if (!orderID) {
    payload.logger.warn('No orderID found in payment intent metadata');
    return;
  }

  try {
    // Update order status to paid
    await payload.update({
      collection: 'orders',
      id: orderID,
      data: {
        status: 'paid',
        paymentStatus: 'completed',
        paidAt: new Date().toISOString(),
      },
    });

    payload.logger.info(`Order ${orderID} marked as paid`);
  } catch (error) {
    payload.logger.error(`Error updating order after successful payment: ${error}`);
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(paymentIntent: any, payload: any) {
  const { orderID } = paymentIntent.metadata;

  if (!orderID) {
    payload.logger.warn('No orderID found in payment intent metadata');
    return;
  }

  try {
    // Update order payment status
    await payload.update({
      collection: 'orders',
      id: orderID,
      data: {
        paymentStatus: 'failed',
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });

    payload.logger.info(`Order ${orderID} marked as payment failed`);
  } catch (error) {
    payload.logger.error(`Error updating order after failed payment: ${error}`);
  }
}
