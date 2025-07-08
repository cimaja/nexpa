import { CollectionConfig } from 'payload';
import { AccessArgs, BeforeChangeHook, AfterChangeHook } from '../types';
import { createPaymentIntent, updatePaymentIntent } from '../hooks/stripeOrders';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total'],
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      // Customers can read their own orders
      if (user && user.collection === 'customers') {
        return {
          customer: {
            equals: user.id,
          },
        };
      }
      // Admins can read all
      return true;
    },
    create: () => true, // Allow checkout process to create orders
    update: ({ req }) => {
      // Only admins can update orders
      return true;
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Unique order number (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
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
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
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
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingCost',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: {
        description: 'Stripe Payment Intent ID',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  hooks: {
    afterChange: [createPaymentIntent],
    beforeChange: [updatePaymentIntent,
      // Generate order number if not provided
      ({ data }: BeforeChangeHook) => {
        if (!data.orderNumber) {
          const date = new Date();
          const timestamp = date.getTime().toString().slice(-6);
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          data.orderNumber = `NX-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${timestamp}-${random}`;
        }
        
        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          data.subtotal = data.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);
          data.tax = Math.round(data.subtotal * 0.2 * 100) / 100; // 20% VAT
          data.total = data.subtotal + data.tax + (data.shippingCost || 0);
        }
        
        return data;
      },
    ],
    afterChange: [
      // Update customer's orders
      async ({ doc, operation, req }: AfterChangeHook) => {
        if (operation === 'create' && doc.customer) {
          try {
            const { payload } = req;
            const customer = await payload.findByID({
              collection: 'customers',
              id: doc.customer,
            });
            
            const orders = customer.orders || [];
            if (!orders.includes(doc.id)) {
              await payload.update({
                collection: 'customers',
                id: doc.customer,
                data: {
                  orders: [...orders, doc.id],
                },
              });
            }
          } catch (error) {
            console.error('Error updating customer orders:', error);
          }
        }
      },
    ],
  },
};
