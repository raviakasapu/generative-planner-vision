import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SpreadsheetHeader from './spreadsheet/SpreadsheetHeader';
import SpreadsheetToolbar from './spreadsheet/SpreadsheetToolbar';
import SpreadsheetTable from './spreadsheet/SpreadsheetTable';
import { PlanningData, ColumnConfig } from './spreadsheet/types';

const Spreadsheet = () => {
  const [data, setData] = useState<PlanningData[]>([]);
  const [viewType, setViewType] = useState<'table' | 'pivot'>('table');
  const [showTotals, setShowTotals] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    dimension1_id: { field: 'dimension1_id', type: 'dimension', filter: '', sortOrder: null, order: 0 },
    dimension2_id: { field: 'dimension2_id', type: 'dimension', filter: '', sortOrder: null, order: 1 },
    measure1: { field: 'measure1', type: 'measure', filter: '', sortOrder: null, order: 2 },
    measure2: { field: 'measure2', type: 'measure', filter: '', sortOrder: null, order: 3 },
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlanningData();
    initializeColumnOrder();
  }, []);

  const initializeColumnOrder = () => {
    const initialOrder = Object.keys(columnConfigs).sort(
      (a, b) => columnConfigs[a].order - columnConfigs[b].order
    );
    setColumnOrder(initialOrder);
  };

  const fetchPlanningData = async () => {
    try {
      const { data, error } = await supabase
        .from('planningdata')
        .select(`
          *,
          masterdimension1!planningdata_dimension1_id_fkey(product_id, product_description),
          masterdimension2!planningdata_dimension2_id_fkey(region_id, region_description)
        `)
        .order('transaction_timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching planning data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch planning data",
        variant: "destructive",
      });
    }
  };

  const handleCellChange = async (rowIndex: number, field: string, value: string) => {
    try {
      const row = data[rowIndex];
      if (!row) return;

      const updateData: any = {
        [field]: field.startsWith('measure') ? parseFloat(value) : value
      };

      const { error } = await supabase
        .from('planningdata')
        .update(updateData)
        .eq('id', row.id);

      if (error) throw error;

      const newData = [...data];
      newData[rowIndex] = { ...row, ...updateData };
      setData(newData);

      toast({
        title: "Updated",
        description: "Planning data updated successfully",
      });
    } catch (error) {
      console.error('Error updating cell:', error);
      toast({
        title: "Error",
        description: "Failed to update planning data",
        variant: "destructive",
      });
    }
  };

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
    const newConfigs = { ...columnConfigs };
    columnOrder.forEach((field, index) => {
      newConfigs[field] = { ...newConfigs[field], order: index };
    });
    setColumnConfigs(newConfigs);
  };

  const toggleSort = (field: string) => {
    const config = columnConfigs[field];
    const newSortOrder = config.sortOrder === 'asc' ? 'desc' : config.sortOrder === 'desc' ? null : 'asc';
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...config, sortOrder: newSortOrder }
    });
  };

  const handleColumnConfigChange = (field: string, type: ColumnConfig['type']) => {
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...columnConfigs[field], type }
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...columnConfigs[field], filter: value }
    });
  };

  const calculateTotals = (field: string) => {
    if (!field.startsWith('measure')) return null;
    return data.reduce((sum, row) => sum + (row[field as keyof PlanningData] as number || 0), 0);
  };

  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(columnConfigs).forEach(([field, config]) => {
      if (config.filter) {
        result = result.filter(row => {
          const value = String(row[field as keyof PlanningData] || '').toLowerCase();
          return value.includes(config.filter.toLowerCase());
        });
      }
    });

    // Apply sorting
    Object.entries(columnConfigs).forEach(([field, config]) => {
      if (config.sortOrder) {
        result.sort((a, b) => {
          const aVal = a[field as keyof PlanningData];
          const bVal = b[field as keyof PlanningData];
          return config.sortOrder === 'asc' 
            ? (aVal || 0) > (bVal || 0) ? 1 : -1
            : (aVal || 0) < (bVal || 0) ? 1 : -1;
        });
      }
    });

    return result;
  }, [data, columnConfigs]);

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
            data={filteredAndSortedData}
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