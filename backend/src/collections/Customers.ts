import { CollectionConfig } from 'payload';
import { AccessArgs } from '../types';
import { syncCustomerToStripe } from '../hooks/stripeCustomers';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    tokenExpiration: 7200, // 2 hours
    cookies: {
      secure: process.env?.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    useAPIKey: true,
    depth: 2,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'preferredLanguage'],
  },
  hooks: {
    afterChange: [syncCustomerToStripe],
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      // Users can read their own document
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        };
      }
      // Admins can read all
      return false;
    },
    create: () => true, // Anyone can create an account
    update: ({ req: { user } }: AccessArgs) => {
      // Users can update their own document
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        };
      }
      // Admins can update all
      return false;
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'preferredLanguage',
      type: 'select',
      options: [
        {
          label: 'Français',
          value: 'fr',
        },
        {
          label: 'English',
          value: 'en',
        },
      ],
      defaultValue: 'fr',
      required: true,
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Shipping',
              value: 'shipping',
            },
            {
              label: 'Billing',
              value: 'billing',
            },
          ],
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'line1',
          type: 'text',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'France',
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      admin: {
        description: 'Stripe Customer ID (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: {
        description: 'Orders placed by this customer',
        readOnly: true,
      },
    },
  ],

};
