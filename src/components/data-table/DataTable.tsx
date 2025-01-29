import React from 'react';
import { Card } from "@/components/ui/card";
import { useDataTable } from '@/hooks/useDataTable';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

const DataTable = () => {
  const { 
    data, 
    loading, 
    columnConfigs,
    pagination,
    updateCell,
    updateColumnConfig,
    addColumn,
    setPagination,
  } = useDataTable();

  if (loading) {
    return (
      <Card className="w-full p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="w-full p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available. This could be because you don't have access to any planning data yet.
            Please contact your administrator to request access.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full overflow-auto">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  {Object.keys(columnConfigs).map((field) => (
                    <DataTableHeader
                      key={field}
                      field={field}
                      config={columnConfigs[field]}
                      onConfigUpdate={(updates) => updateColumnConfig(field, updates)}
                      onAddColumn={addColumn}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(
                  pagination.page * pagination.pageSize,
                  (pagination.page + 1) * pagination.pageSize
                ).map((row) => (
                  <tr key={row.id} className="hover:bg-muted/50">
                    {Object.keys(columnConfigs).map((field) => (
                      <DataTableBody
                        key={field}
                        row={row}
                        field={field}
                        config={columnConfigs[field]}
                        onChange={(value) => updateCell(row.id, field, value)}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTablePagination
            total={data.length}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onChange={setPagination}
          />
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default DataTable;