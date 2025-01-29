import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDataTable } from '@/hooks/useDataTable';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';
import AddColumnDialog from './AddColumnDialog';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    isAddColumnDialogOpen,
    setAddColumnDialogOpen
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
    <Card className="w-full overflow-auto">
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddColumnDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(columnConfigs).map((field) => (
                  <DataTableHeader
                    key={field}
                    field={field}
                    config={columnConfigs[field]}
                    onConfigUpdate={(updates) => updateColumnConfig(field, updates)}
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
          {...pagination}
          onChange={setPagination}
        />

        <AddColumnDialog
          open={isAddColumnDialogOpen}
          onOpenChange={setAddColumnDialogOpen}
          onAdd={addColumn}
        />
      </div>
    </Card>
  );
};

export default DataTable;