import { NextAdmin } from '@premieroctet/next-admin';
import { getNextAdminProps } from '@premieroctet/next-admin/appRouter';
import { prisma } from '@/lib/prisma';
import {
  nextAdminOptions,
  ADMIN_BASE_PATH,
  ADMIN_API_BASE_PATH,
} from '@/lib/next-admin';
import '@premieroctet/next-admin/theme';

export default async function AdminPanelPage({
  params,
  searchParams,
}: {
  params: Promise<{ nextadmin?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { nextadmin } = await params;
  const search = await searchParams;

  const props = await getNextAdminProps({
    params: nextadmin,
    searchParams: search,
    basePath: ADMIN_BASE_PATH,
    apiBasePath: ADMIN_API_BASE_PATH,
    prisma,
    options: nextAdminOptions,
  });

  return <NextAdmin {...props} />;
}
