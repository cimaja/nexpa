# Nexpa Surf Shop - Deployment Guide

This document outlines the steps to deploy the Nexpa Surf Shop e-commerce platform.

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Stripe account
- Render/Fly.io account (for backend)
- Vercel account (for frontend)

## Backend Deployment (Render/Fly.io)

### Deploying to Render

1. **Create a new Web Service**
   - Connect your GitHub repository
   - Select the `/backend` directory
   - Choose "Node" as the runtime
   - Set the build command: `npm install`
   - Set the start command: `npm run serve`

2. **Configure Environment Variables**
   Add the following environment variables in the Render dashboard:
   ```
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/nexpa
   PAYLOAD_SECRET=your_payload_secret_key
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.onrender.com
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   CRON_SECRET=your_cron_secret
   PREVIEW_SECRET=your_preview_secret
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete

### Deploying to Fly.io (Alternative)

1. **Install Flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

3. **Create a fly.toml file in the backend directory**
   ```bash
   cd backend
   flyctl launch
   ```

4. **Set Environment Variables**
   ```bash
   flyctl secrets set DATABASE_URI="mongodb+srv://username:password@cluster.mongodb.net/nexpa"
   flyctl secrets set PAYLOAD_SECRET="your_payload_secret_key"
   # Set all other environment variables
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```

## Frontend Deployment (Vercel)

1. **Connect Your Repository**
   - Import your GitHub repository in Vercel
   - Set the root directory to `/frontend`

2. **Configure Environment Variables**
   Add the following environment variables in the Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

## Post-Deployment Configuration

### CORS Configuration

Ensure that your backend's CORS settings allow requests from your frontend domain:

```typescript
// In backend/src/payload.config.ts
export default buildConfig({
  cors: [
    'https://your-frontend-domain.vercel.app',
    // Add any other domains that need access
  ],
  // ...other config
});
```

### Stripe Webhooks

1. Go to the Stripe Dashboard > Developers > Webhooks
2. Add a new endpoint: `https://your-backend-url.onrender.com/api/stripe-webhook`
3. Select the following events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Get the webhook signing secret and add it to your backend environment variables as `STRIPE_WEBHOOK_SECRET`

### DNS Configuration (Optional)

If you want to use custom domains:

1. Purchase a domain name
2. Configure DNS settings to point to your Vercel and Render/Fly.io deployments
3. Update environment variables to use your custom domains
4. Update CORS settings to include your custom domains

## Monitoring and Logging

### Vercel Analytics

Enable Vercel Analytics in your project settings for frontend monitoring.

### Render Logs

Access logs through the Render dashboard for backend monitoring.

## Troubleshooting

- **Database Connection Issues**: Verify that your MongoDB Atlas IP whitelist includes your deployment provider's IPs
- **CORS Errors**: Check that your backend CORS settings include your frontend domain
- **Stripe Webhook Failures**: Verify the webhook secret and ensure the correct events are being listened for

For additional support, refer to the documentation for [Render](https://render.com/docs), [Fly.io](https://fly.io/docs), [Vercel](https://vercel.com/docs), or [Stripe](https://stripe.com/docs).
