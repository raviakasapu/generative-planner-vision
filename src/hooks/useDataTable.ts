import { useColumnConfig } from './useColumnConfig';
import { useDataFiltering } from './useDataFiltering';
import { usePlanningData } from './usePlanningData';
import { usePagination } from './usePagination';

export const useDataTable = () => {
  const { columnConfigs, updateColumnConfig, addColumn } = useColumnConfig();
  const { rawData, loading, updateCell } = usePlanningData();
  const filteredData = useDataFiltering(rawData, columnConfigs);
  const { pagination, setPagination } = usePagination();

  return {
    data: filteredData,
    loading,
    columnConfigs,
    pagination,
    updateCell,
    updateColumnConfig,
    addColumn,
    setPagination,
  };
};