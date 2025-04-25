import { fetchInvoicesPages } from '@/app/lib/data';
import InvoicesTable from '@/app/ui/invoices/table';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Default fallback if searchParams is undefined or properties are missing
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const pageParam = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;
  const currentPage = isNaN(pageParam) ? 1 : pageParam;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <main>
      <Search placeholder="Search invoices..." />
      <Suspense fallback={<div>Loading...</div>}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </main>
  );
}
