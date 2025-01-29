import { useState } from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
}

export const usePagination = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 20
  });

  return {
    pagination,
    setPagination
  };
};