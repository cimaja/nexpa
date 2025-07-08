import { AfterChangeHook, BeforeChangeHook } from '../types';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create or update a product in Stripe when a product is created or updated in Payload
export const syncProductToStripe: AfterChangeHook = async ({ doc, req }) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    req.payload.logger.warn('Stripe secret key not found. Skipping Stripe product sync.');
    return;
  }

  try {
    // Check if product already exists in Stripe
    let stripeProduct;
    if (doc.stripeProductID) {
      // Update existing product
      stripeProduct = await stripe.products.update(doc.stripeProductID, {
        name: doc.title,
        description: doc.description || '',
        active: doc.status === 'active',
        metadata: {
          payloadID: doc.id,
        },
        images: doc.images?.map((image: any) => 
          `${process.env.NEXT_PUBLIC_SERVER_URL}${image.image.url}`
        ) || [],
      });

      // Update or create price
      if (doc.price) {
        if (doc.stripePriceID) {
          // Stripe doesn't allow updating prices, so we create a new one and archive the old one
          await stripe.prices.update(doc.stripePriceID, { active: false });
        }

        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(doc.price * 100), // Convert to cents
          currency: 'eur',
        });

        // Save the new price ID back to Payload
        await req.payload.update({
          collection: 'products',
          id: doc.id,
          data: {
            stripePriceID: price.id,
          },
        });
      }
    } else {
      // Create new product
      stripeProduct = await stripe.products.create({
        name: doc.title,
        description: doc.description || '',
        active: doc.status === 'active',
        metadata: {
          payloadID: doc.id,
        },
        images: doc.images?.map((image: any) => 
          `${process.env.NEXT_PUBLIC_SERVER_URL}${image.image.url}`
        ) || [],
      });

      // Create price
      if (doc.price) {
        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(doc.price * 100), // Convert to cents
          currency: 'eur',
        });

        // Save the Stripe IDs back to Payload
        await req.payload.update({
          collection: 'products',
          id: doc.id,
          data: {
            stripeProductID: stripeProduct.id,
            stripePriceID: price.id,
          },
        });
      }
    }

    req.payload.logger.info(`Product ${doc.id} synced to Stripe successfully.`);
  } catch (error) {
    req.payload.logger.error(`Error syncing product to Stripe: ${error}`);
  }
};

// Archive product in Stripe when deleted in Payload
export const archiveProductInStripe: BeforeChangeHook = async ({ req, originalDoc }) => {
  if (!process.env.STRIPE_SECRET_KEY || !originalDoc.stripeProductID) {
    return;
  }

  try {
    await stripe.products.update(originalDoc.stripeProductID, {
      active: false,
    });

    req.payload.logger.info(`Product ${originalDoc.id} archived in Stripe.`);
  } catch (error) {
    req.payload.logger.error(`Error archiving product in Stripe: ${error}`);
  }
};
