# Nexpa Surf Shop - Project Documentation

## Overview

Nexpa is a multilingual e-commerce platform for a surf shop based in Six-Fours-les-Plages, France. The shop specializes in Wing, Surf, and SUP equipment, offering both new and second-hand ("occasions") products. The platform will be built with modern web technologies, focusing on a beautiful, surf-inspired design, excellent user experience, and robust e-commerce functionality.

## Project Requirements

### Business Requirements

- **Multilingual Support**: French (default) and English
- **Product Categories**:
  - Wing (new and second-hand)
  - Surf (new and second-hand)
  - SUP (new and second-hand)
- **E-commerce Features**:
  - Product browsing and filtering
  - Shopping cart
  - Secure checkout with Stripe
  - Customer accounts
  - Order management
- **Location**: Six-Fours-les-Plages, France

### Technical Requirements

- **Tech Stack**:
  - **Backend**: Payload CMS with MongoDB
  - **Frontend**: Next.js with Tailwind CSS
  - **Localization**: i18next/next-i18next
  - **Payments**: Stripe integration
  - **Deployment**: Render/Fly.io (backend), Vercel (frontend)
  - **Repository**: Monorepo structure

- **Visual Design**:
  - **Color Palette**:
    - Sunset Orange (#FF7A00)
    - Ocean Blue (#1A96B0)
    - Sandy Beige (#F2E3C9)
    - Coral Pink (#FF5A5F)
    - Off-whites/Light Grays
  - **Typography**:
    - Headings: Montserrat/Quicksand
    - Body: Nunito/Open Sans
    - Accents: Surf-inspired display font
  - **Visual Motifs**:
    - Wave patterns
    - Palm/surfboard silhouettes
    - Sun/sunset imagery
    - Water-inspired transitions
  - **Layout**:
    - Clean, airy design
    - Horizontal carousels
    - Full-width images
    - Mobile-first approach

## Project Structure

```
/Nexpa (monorepo)
├── /backend                # Payload CMS application
│   ├── /src
│   │   ├── /collections    # Database collections
│   │   ├── /hooks          # Payload hooks (Stripe integration, etc.)
│   │   ├── /scripts        # Utility scripts (seeding, testing)
│   │   └── payload.config.ts
│   ├── .env                # Environment variables
│   └── package.json
├── /frontend               # Next.js application
│   ├── /src
│   │   ├── /app            # Next.js app router
│   │   │   └── /[locale]   # Locale-specific routes
│   │   ├── /components     # React components
│   │   │   ├── /ui         # Reusable UI components
│   │   │   └── /layouts    # Page layouts
│   │   ├── /lib            # Utility functions
│   │   └── /styles         # Global styles
│   ├── .env                # Environment variables
│   └── package.json
├── DEPLOYMENT.md           # Deployment instructions
├── NEXPA.md                # This project documentation
└── README.md               # Brief project overview
```

## Development Plan

### 1. Environment & Project Setup

- **Create Project Structure**
  - Set up monorepo with backend and frontend folders
  - Initialize Git repository

- **Configure Development Environment**
  - Set up ESLint, Prettier for code formatting
  - Configure TypeScript

- **Database Setup**
  - Create MongoDB Atlas cluster
  - Set up database user and access
  - Configure connection string in .env

- **Stripe Setup**
  - Create Stripe account if needed
  - Get API keys for development

### 2. Backend Development (Payload CMS)

- **Initialize Payload CMS**
  ```bash
  cd backend
  npx create-payload-app
  ```

- **Configure Payload CMS**
  - Set up MongoDB connection
  - Configure localization
  - Set up authentication
  - Configure admin panel

- **Create Collections**
  - **Media**: For product images
    - Fields: alt text (localized)
  
  - **Categories**: For product categorization
    - Fields: name (localized), slug (localized), parent category, isOccasion flag
  
  - **Products**: Main product collection
    - Fields: title (localized), price, description (localized), category, images, Stripe ID
    - Hooks: Stripe product synchronization
  
  - **Customers**: For user accounts
    - Fields: email, password, name, phone, addresses, preferred language, Stripe customer ID
    - Authentication: Email/password with JWT
  
  - **Orders**: For purchase tracking
    - Fields: order number, customer, items, status, shipping/billing addresses, subtotal, tax, shipping cost, total, payment info
    - Hooks: Generate order number, calculate totals, update customer orders

- **Implement Stripe Integration**
  - Create hooks for product sync with Stripe
  - Create hooks for customer sync with Stripe
  - Set up payment intent creation for checkout

- **Create Utility Scripts**
  - Category seeding script
  - Testing scripts for auth, orders, and Stripe

- **Test Backend Functionality**
  - Authentication flow
  - Product CRUD operations
  - Order creation and management
  - Stripe synchronization

### 3. Frontend Development (Next.js)

- **Initialize Next.js Project**
  ```bash
  cd frontend
  npx create-next-app@latest
  ```

- **Configure Localization**
  - Install i18next/next-i18next
  - Set up locale files for French and English
  - Create language detection and switching

- **Design System Implementation**
  - Create design tokens file
  - Configure Tailwind CSS
  - Set up theme provider

- **Develop UI Component Library**
  - **Button**: Multiple variants, sizes
  - **Card**: Product and category cards
  - **Input**: Form fields with validation
  - **Header/Footer**: Site navigation
  - **LanguageSwitcher**: Language toggle component

- **Create Page Layout**
  - Responsive layout components
  - Header with navigation
  - Footer with info and links

- **Develop Page Routes**
  - Home page with featured products
  - Category and subcategory pages
  - Product detail pages
  - Cart and checkout flow
  - Customer account pages

- **Implement API Integration**
  - Create API client for Payload CMS
  - Set up data fetching with SWR or React Query
  - Implement authentication context

- **Build E-commerce Features**
  - Product browsing and filtering
  - Shopping cart functionality
  - Checkout process with Stripe
  - Order tracking

### 4. Integration & Testing

- **End-to-End Testing**
  - User registration and login
  - Product browsing and search
  - Cart and checkout flow
  - Order management

- **Performance Testing**
  - Page load speed optimization
  - API response time testing
  - Mobile responsiveness testing

- **Cross-browser Testing**
  - Test on Chrome, Firefox, Safari
  - Test on iOS and Android

### 5. Deployment

- **Backend Deployment (Render/Fly.io)**
  - Create `render.yaml` configuration
  - Set environment variables
  - Deploy backend service

- **Frontend Deployment (Vercel)**
  - Create `vercel.json` configuration
  - Configure environment variables
  - Deploy frontend application

- **Post-Deployment Configuration**
  - Set up CORS for API
  - Configure Stripe webhooks
  - Set up monitoring and logging

## Task Checklist

### Environment & Project Setup

- [ ] Create GitHub repository with monorepo structure
- [ ] Set up .env files for backend and frontend
- [ ] Create MongoDB Atlas cluster and obtain connection string
- [ ] Set up Stripe account and get API keys

### Backend Development

- [ ] Initialize Payload CMS project
- [ ] Configure MongoDB connection
- [ ] Create Media collection
- [ ] Create Categories collection
- [ ] Create Products collection with Stripe hooks
- [ ] Create Customers collection with authentication
- [ ] Create Orders collection with relationship to customers
- [ ] Implement category seeding script
- [ ] Implement Stripe integration (products, customers)
- [ ] Create test scripts for auth and orders
- [ ] Test backend functionality

### Frontend Development

- [ ] Initialize Next.js project
- [ ] Configure i18next for localization
- [ ] Set up Tailwind CSS with custom theme
- [ ] Create design tokens file
- [ ] Develop Button component
- [ ] Develop Card component
- [ ] Develop Input component
- [ ] Develop Header component with navigation
- [ ] Develop Footer component
- [ ] Implement LanguageSwitcher
- [ ] Create home page layout
- [ ] Create category page layout
- [ ] Create product detail page layout
- [ ] Create cart and checkout pages
- [ ] Create customer account pages
- [ ] Implement API client for Payload CMS
- [ ] Set up authentication context
- [ ] Implement shopping cart functionality
- [ ] Implement checkout with Stripe

### Deployment & Testing

- [ ] Create `render.yaml` for backend deployment
- [ ] Create `vercel.json` for frontend deployment
- [ ] Set up environment variables in deployment platforms
- [ ] Deploy backend to Render/Fly.io
- [ ] Deploy frontend to Vercel
- [ ] Test complete purchase flow in production
- [ ] Set up Stripe webhooks for production
- [ ] Create comprehensive documentation

## Environment Variables

### Backend (.env)

```
# Database connection
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/nexpa

# Payload CMS
PAYLOAD_SECRET=your_payload_secret_key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Stripe integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Additional security
CRON_SECRET=your_cron_secret
PREVIEW_SECRET=your_preview_secret
```

### Frontend (.env)

```
# API connection
NEXT_PUBLIC_API_URL=http://localhost:3000

# Stripe 
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Conclusion

This document outlines the comprehensive plan for developing the Nexpa Surf Shop e-commerce platform. By following this structured approach, we will create a modern, multilingual online store with a beautiful design and robust functionality.

The monorepo structure will allow for easier development, versioning, and deployment of both the backend and frontend components. The use of Payload CMS provides a flexible and powerful backend, while Next.js offers an excellent framework for building a fast, SEO-friendly frontend.

As development progresses, this document can be updated to reflect changes in requirements or approach.
