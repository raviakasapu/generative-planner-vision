import React from 'react';
import { Card } from "@/components/ui/card";
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import SpreadsheetHeader from './spreadsheet/SpreadsheetHeader';
import SpreadsheetCell from './spreadsheet/SpreadsheetCell';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Spreadsheet = () => {
  const { 
    data, 
    loading, 
    columnConfigs, 
    updateCell, 
    updateColumnConfig,
    addDimensionColumn 
  } = useSpreadsheetData();

  const dimensionColumns = {
    dimension1: [
      { value: 'product_id', label: 'Product ID' },
      { value: 'product_description', label: 'Product Description' },
      { value: 'category', label: 'Category' },
      { value: 'hierarchy_level', label: 'Hierarchy Level' },
    ],
    dimension2: [
      { value: 'region_id', label: 'Region ID' },
      { value: 'region_description', label: 'Region Description' },
      { value: 'country', label: 'Country' },
      { value: 'sales_manager', label: 'Sales Manager' },
    ],
  };

  const getCellValue = (row: any, field: string): string => {
    if (field.includes('dimension')) {
      const dimensionData = field === 'dimension1_id' ? row.masterdimension1 : row.masterdimension2;
      if (!dimensionData) return '';
      
      const selectedColumn = columnConfigs[field].selectedColumn;
      return String(dimensionData[selectedColumn] || '');
    }
    
    return String(row[field] || '');
  };

  const filteredData = data.filter(row => {
    return Object.entries(columnConfigs).every(([field, config]) => {
      if (!config.filter) return true;
      
      const cellValue = getCellValue(row, field).toLowerCase();
      return cellValue.includes(config.filter.toLowerCase());
    });
  });

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Add Product Column
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {dimensionColumns.dimension1.map((column) => (
                    <DropdownMenuItem
                      key={column.value}
                      onClick={() => addDimensionColumn('dimension1', column.value)}
                    >
                      {column.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Add Region Column
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {dimensionColumns.dimension2.map((column) => (
                    <DropdownMenuItem
                      key={column.value}
                      onClick={() => addDimensionColumn('dimension2', column.value)}
                    >
                      {column.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(columnConfigs).map((field) => (
                  <SpreadsheetHeader
                    key={field}
                    field={field}
                    config={columnConfigs[field]}
                    onConfigUpdate={(updates) => updateColumnConfig(field, updates)}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  {Object.keys(columnConfigs).map((field) => (
                    <SpreadsheetCell
                      key={field}
                      row={row}
                      field={field}
                      value={getCellValue(row, field)}
                      onChange={(value) => updateCell(row.id, field, value)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default Spreadsheet;