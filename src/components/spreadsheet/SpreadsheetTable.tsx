import React from 'react';
import { PlanningData, ColumnConfig } from './types';

interface SpreadsheetTableProps {
  data: PlanningData[];
  columnOrder: string[];
  showTotals: boolean;
  onCellChange: (rowIndex: number, field: string, value: string) => void;
  calculateTotals: (field: string) => number | null;
  columnConfigs: Record<string, ColumnConfig>;
}

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({
  data,
  columnOrder,
  showTotals,
  onCellChange,
  calculateTotals,
  columnConfigs,
}) => {
  const getCellValue = (row: PlanningData, field: string): string => {
    if (field.includes('dimension')) {
      const dimensionData = field === 'dimension1_id' 
        ? row.masterdimension1 
        : row.masterdimension2;
      
      if (!dimensionData) return '';
      
      const selectedColumn = columnConfigs[field]?.selectedColumn;
      if (!selectedColumn) return '';

      return String(dimensionData[selectedColumn as keyof typeof dimensionData] || '');
    }
    
    const value = row[field as keyof PlanningData];
    return value !== null ? String(value) : '';
  };

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={row.id}>
          {columnOrder.map((field) => (
            <td key={field} className="border p-2">
              <input
                type={field.startsWith('measure') ? "number" : "text"}
                className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                value={getCellValue(row, field)}
                onChange={(e) => onCellChange(rowIndex, field, e.target.value)}
              />
            </td>
          ))}
        </tr>
      ))}
      {showTotals && (
        <tr className="font-bold bg-muted/50">
          {columnOrder.map((field) => (
            <td key={field} className="border p-2">
              {calculateTotals(field)?.toFixed(2) || ''}
            </td>
          ))}
        </tr>
      )}
    </tbody>
  );
};

export default SpreadsheetTable;