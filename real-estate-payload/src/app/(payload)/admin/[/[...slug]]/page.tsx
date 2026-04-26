import { RootPage } from '@payloadcms/next/RootPage';
import config from '../../../../payload.config';

export default function AdminPage() {
  return RootPage(config);
}