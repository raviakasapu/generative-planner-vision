import { useState } from 'react';
import { PaginationState } from '@/components/data-table/types';

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