import { AfterChangeHook } from '../types';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create or update a customer in Stripe when a customer is created or updated in Payload
export const syncCustomerToStripe: AfterChangeHook = async ({ doc, operation, req }) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    req.payload.logger.warn('Stripe secret key not found. Skipping Stripe customer sync.');
    return;
  }

  try {
    // Check if customer already exists in Stripe
    if (operation === 'create' || (operation === 'update' && !doc.stripeCustomerID)) {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({
        email: doc.email,
        name: doc.name || '',
        phone: doc.phone || '',
        address: doc.shippingAddress ? {
          line1: doc.shippingAddress.line1 || '',
          line2: doc.shippingAddress.line2 || '',
          city: doc.shippingAddress.city || '',
          postal_code: doc.shippingAddress.postalCode || '',
          country: doc.shippingAddress.country || 'FR',
        } : undefined,
        metadata: {
          payloadID: doc.id,
          preferredLanguage: doc.preferredLanguage || 'fr',
        },
      });

      // Save the Stripe customer ID back to Payload
      await req.payload.update({
        collection: 'customers',
        id: doc.id,
        data: {
          stripeCustomerID: customer.id,
        },
      });

      req.payload.logger.info(`Customer ${doc.id} created in Stripe with ID: ${customer.id}`);
    } else if (operation === 'update' && doc.stripeCustomerID) {
      // Update existing customer in Stripe
      await stripe.customers.update(doc.stripeCustomerID, {
        email: doc.email,
        name: doc.name || '',
        phone: doc.phone || '',
        address: doc.shippingAddress ? {
          line1: doc.shippingAddress.line1 || '',
          line2: doc.shippingAddress.line2 || '',
          city: doc.shippingAddress.city || '',
          postal_code: doc.shippingAddress.postalCode || '',
          country: doc.shippingAddress.country || 'FR',
        } : undefined,
        metadata: {
          payloadID: doc.id,
          preferredLanguage: doc.preferredLanguage || 'fr',
        },
      });

      req.payload.logger.info(`Customer ${doc.id} updated in Stripe.`);
    }
  } catch (error) {
    req.payload.logger.error(`Error syncing customer to Stripe: ${error}`);
  }
};
