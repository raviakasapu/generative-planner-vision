import React from 'react';
import { Card } from "@/components/ui/card";
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import SpreadsheetHeader from './spreadsheet/SpreadsheetHeader';
import SpreadsheetCell from './spreadsheet/SpreadsheetCell';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Spreadsheet = () => {
  const { 
    data, 
    loading, 
    columnConfigs, 
    updateCell, 
    updateColumnConfig,
    addDimensionColumn 
  } = useSpreadsheetData();

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

  return (
    <Card className="w-full overflow-auto">
      <div className="p-4">
        <div className="flex justify-end mb-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addDimensionColumn('dimension1')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addDimensionColumn('dimension2')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Region Column
          </Button>
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