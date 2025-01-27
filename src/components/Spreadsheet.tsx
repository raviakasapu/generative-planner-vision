import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import SpreadsheetHeader from './spreadsheet/SpreadsheetHeader';
import SpreadsheetToolbar from './spreadsheet/SpreadsheetToolbar';
import SpreadsheetTable from './spreadsheet/SpreadsheetTable';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';

const Spreadsheet = () => {
  const [viewType, setViewType] = useState<'table' | 'pivot'>('table');
  const [showTotals, setShowTotals] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  
  const {
    data,
    columnConfigs,
    columnOrder,
    setColumnOrder,
    handleCellChange,
    handleColumnConfigChange,
    handleFilterChange,
    toggleSort,
    calculateTotals,
  } = useSpreadsheetData();

  const handleColumnDragStart = (field: string) => {
    setDraggedColumn(field);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetField: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetField) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetField);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
  };

  return (
    <Card className="w-full h-[600px] overflow-auto">
      <div className="p-4">
        <SpreadsheetToolbar
          viewType={viewType}
          showTotals={showTotals}
          onViewTypeChange={setViewType}
          onShowTotalsChange={setShowTotals}
        />

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columnOrder.map((field) => (
                <SpreadsheetHeader
                  key={field}
                  field={field}
                  config={columnConfigs[field]}
                  onDragStart={() => handleColumnDragStart(field)}
                  onDragOver={(e) => handleColumnDragOver(e, field)}
                  onDragEnd={handleColumnDragEnd}
                  onSortChange={() => toggleSort(field)}
                  onTypeChange={(value) => handleColumnConfigChange(field, value)}
                  onFilterChange={(value) => handleFilterChange(field, value)}
                />
              ))}
            </tr>
          </thead>
          <SpreadsheetTable
            data={data}
            columnOrder={columnOrder}
            showTotals={showTotals}
            onCellChange={handleCellChange}
            calculateTotals={calculateTotals}
          />
        </table>
      </div>
    </Card>
  );
};

export default Spreadsheet;