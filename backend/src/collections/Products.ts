import { CollectionConfig } from 'payload';
import { syncProductToStripe, archiveProductInStripe } from '../hooks/stripeProducts';
import { BeforeChangeHook, SiblingData } from '../types';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'isOccasion'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'URL-friendly version of the product title (auto-generated if left blank)',
      },
      hooks: {
        beforeValidate: [
          ({ data, siblingData }: { data: string | undefined; siblingData: SiblingData }) => {
            if (!data && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
            }
            return data;
          },
        ],
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price for sale items',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'isOccasion',
      type: 'checkbox',
      label: 'Is Second-Hand',
      defaultValue: false,
      admin: {
        description: 'Check if this is a second-hand product',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Available',
          value: 'available',
        },
        {
          label: 'Sold Out',
          value: 'sold-out',
        },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'stripeProductID',
      type: 'text',
      admin: {
        description: 'Stripe Product ID (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'stripePriceID',
      type: 'text',
      admin: {
        description: 'Stripe Price ID (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'features',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    // Stripe hooks will be implemented later
  },
};
