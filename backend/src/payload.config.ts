import { buildConfig } from 'payload/config';
import path from 'path';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';

// Import collections
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Products } from './collections/Products';
import { Customers } from './collections/Customers';
import { Orders } from './collections/Orders';

export default buildConfig({
  admin: {
    user: 'Customers',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost/nexpa',
  }),
  collections: [
    Media,
    Categories,
    Products,
    Customers,
    Orders,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  localization: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    fallback: true,
  },
  cors: [
    process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3001',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3001',
  ],
});
