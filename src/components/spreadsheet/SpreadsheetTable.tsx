import React from 'react';
import { PlanningData } from './types';

interface SpreadsheetTableProps {
  data: PlanningData[];
  columnOrder: string[];
  showTotals: boolean;
  onCellChange: (rowIndex: number, field: string, value: string) => void;
  calculateTotals: (field: string) => number | null;
}

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({
  data,
  columnOrder,
  showTotals,
  onCellChange,
  calculateTotals,
}) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={row.id}>
          {columnOrder.map((field) => (
            <td key={field} className="border p-2">
              <input
                type={field.startsWith('measure') ? "number" : "text"}
                className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                value={row[field as keyof PlanningData] || ''}
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