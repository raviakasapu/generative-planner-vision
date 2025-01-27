import React from 'react';
import { Card } from "@/components/ui/card";
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import SpreadsheetHeader from './spreadsheet/SpreadsheetHeader';
import SpreadsheetCell from './spreadsheet/SpreadsheetCell';
import { Skeleton } from "@/components/ui/skeleton";

const Spreadsheet = () => {
  const { data, loading, columnConfigs, updateCell, updateColumnConfig } = useSpreadsheetData();

  const columnOrder = ['dimension1_id', 'dimension2_id', 'measure1', 'measure2'];

  if (loading) {
    return (
      <Card className="w-full p-4 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  const getCellValue = (row: any, field: string): string => {
    if (field.includes('dimension')) {
      const dimensionData = field === 'dimension1_id' ? row.masterdimension1 : row.masterdimension2;
      if (!dimensionData) return '';
      
      const selectedColumn = columnConfigs[field].selectedColumn;
      return String(dimensionData[selectedColumn] || '');
    }
    
    return String(row[field] || '');
  };

  return (
    <Card className="w-full overflow-auto">
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columnOrder.map((field) => (
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
              {data.map((row) => (
                <tr key={row.id}>
                  {columnOrder.map((field) => (
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