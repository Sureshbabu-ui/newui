import { range } from 'ramda';
import { useState } from 'react';

export function Pagination({
  currentPage,
  count,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  count: number;
  itemsPerPage: number;
  onPageChange?: (index: number) => void;
}) {
  const totalPages = Math.ceil(count / itemsPerPage);

  const getVisiblePageNumbers = () => {
    if (totalPages <= 10) {
      return range(1, totalPages + 1);
    }

   else if (currentPage <= 6) {
      return [...range(1, 8),'...', totalPages]; 
    }

  else  if (currentPage >=totalPages - 4) {
      return [1,'...', ...range(totalPages-6, totalPages+1)];
    }

    return [1,'...', ...range(currentPage - 3, currentPage + 3),'...', totalPages];
  }; 

  return (
    <nav>
      <ul className='pagination'>
        {totalPages > 1 &&
          getVisiblePageNumbers().map((page) => (
            <li
              key={page}
              className={`page-item${currentPage === page ? ' active' : ''}`}
              onClick={() => onPageChange && Number(page) && onPageChange(Number(page))}
            >
              <a className='page-link pseudo-link' aria-label={`Go to page number ${page}`}>
                {page}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
}
