import { RootPage, generateMetadata } from '@payloadcms/next/views'
import config from '../../../payload.config'

export { generateMetadata }

export default async function Page(props: any) {
  return RootPage({ ...props, config })
}