# Nexpa Surf Shop

A multilingual e-commerce platform for a surf shop based in Six-Fours-les-Plages, France. The shop specializes in Wing, Surf, and SUP equipment, offering both new and second-hand products.

## Tech Stack

- **Backend**: Payload CMS with MongoDB
- **Frontend**: Next.js with Tailwind CSS
- **Localization**: i18next/next-i18next
- **Payments**: Stripe integration
- **Deployment**: Render/Fly.io (backend), Vercel (frontend)

## Project Structure

This is a monorepo containing both the backend (Payload CMS) and frontend (Next.js) applications.

```
/Nexpa
├── /backend                # Payload CMS application
├── /frontend               # Next.js application
├── DEPLOYMENT.md           # Deployment instructions
├── NEXPA.md                # Project documentation
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Stripe account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/cimaja/nexpa.git
   cd nexpa
   ```

2. Set up backend
   ```
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB and Stripe credentials
   npm run dev
   ```

3. Set up frontend
   ```
   cd frontend
   npm install
   cp .env.example .env
   # Update .env with your API URL and Stripe publishable key
   npm run dev
   ```

## Documentation

For detailed documentation, see [NEXPA.md](NEXPA.md).
For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
