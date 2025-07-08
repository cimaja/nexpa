import { CollectionConfig } from 'payload/types';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
        description: 'URL-friendly version of the category name (auto-generated if left blank)',
      },
      hooks: {
        beforeValidate: [
          ({ data, siblingData }) => {
            if (!data && siblingData?.name) {
              return siblingData.name
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Parent category (leave blank for top-level categories)',
      },
    },
    {
      name: 'isOccasion',
      type: 'checkbox',
      label: 'Is Second-Hand',
      defaultValue: false,
      admin: {
        description: 'Check if this category is for second-hand products',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category image',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
  ],
};
