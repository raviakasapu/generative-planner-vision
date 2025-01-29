import { useMemo } from 'react';

export const useDataFiltering = (rawData: any[], columnConfigs: Record<string, any>) => {
  const filteredData = useMemo(() => {
    return rawData;
  }, [rawData]);

  return filteredData;
};