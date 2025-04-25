'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={typeof page === 'number' ? createPageURL(page) : '#'}
              page={page}
              position={position}
              isActive={typeof page === 'number' && currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

// Helper component: PaginationArrow
function PaginationArrow({
  direction,
  href,
  isDisabled,
}: {
  direction: 'left' | 'right';
  href: string;
  isDisabled: boolean;
}) {
  const Icon = direction === 'left' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300',
        {
          'pointer-events-none text-gray-400': isDisabled,
        }
      )}
      aria-disabled={isDisabled}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

// Helper component: PaginationNumber
function PaginationNumber({
  href,
  page,
  isActive,
  position,
}: {
  href: string;
  page: number | string;
  isActive: boolean;
  position?: 'first' | 'last' | 'single' | 'middle';
}) {
  if (page === '...') {
    return (
      <span className="flex items-center justify-center px-3 py-2 text-sm text-gray-500">
        ...
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center justify-center px-3 py-2 text-sm border border-gray-300',
        {
          'bg-blue-500 text-white': isActive,
          'hover:bg-gray-100 text-gray-700': !isActive,
        }
      )}
    >
      {page}
    </Link>
  );
}
