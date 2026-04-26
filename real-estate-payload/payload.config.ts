import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: 'users',
  },
  editor: lexicalEditor,
  collections: [
    {
      slug: 'users',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'password',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  db: postgresAdapter({
    client: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
});