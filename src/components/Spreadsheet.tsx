import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Table, GripHorizontal } from "lucide-react";

interface PlanningData {
  id: string;
  dimension1_id: string | null;
  dimension2_id: string | null;
  measure1: number | null;
  measure2: number | null;
}

interface ColumnConfig {
  field: string;
  type: 'dimension' | 'attribute' | 'hierarchy' | 'measure';
  filter: string;
  sortOrder: 'asc' | 'desc' | null;
  order: number;
}

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
    // Update column configs with new order
    const newConfigs = { ...columnConfigs };
    columnOrder.forEach((field, index) => {
      newConfigs[field] = { ...newConfigs[field], order: index };
    });
    setColumnConfigs(newConfigs);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Planning Data</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewType('table')}>
                Table View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType('pivot')}>
                Pivot View
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={showTotals}
                onCheckedChange={setShowTotals}
              >
                Show Totals
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columnOrder.map((field) => (
                <th 
                  key={field} 
                  className="border p-2 bg-muted font-medium cursor-move"
                  draggable
                  onDragStart={() => handleColumnDragStart(field)}
                  onDragOver={(e) => handleColumnDragOver(e, field)}
                  onDragEnd={handleColumnDragEnd}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{field}</span>
                      <div className="flex items-center gap-2">
                        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSort(field)}
                        >
                          {columnConfigs[field].sortOrder === 'asc' ? '↑' : columnConfigs[field].sortOrder === 'desc' ? '↓' : '↕'}
                        </Button>
                      </div>
                    </div>
                    <Select
                      value={columnConfigs[field].type}
                      onValueChange={(value) => handleColumnConfigChange(field, value as ColumnConfig['type'])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dimension">Dimension</SelectItem>
                        <SelectItem value="attribute">Attribute</SelectItem>
                        <SelectItem value="hierarchy">Hierarchy</SelectItem>
                        <SelectItem value="measure">Measure</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Filter..."
                      value={columnConfigs[field].filter}
                      onChange={(e) => handleFilterChange(field, e.target.value)}
                      className="w-full"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, rowIndex) => (
              <tr key={row.id}>
                {columnOrder.map((field) => (
                  <td key={field} className="border p-2">
                    <input
                      type={field.startsWith('measure') ? "number" : "text"}
                      className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                      value={row[field as keyof PlanningData] || ''}
                      onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
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
        </table>
      </div>
    </Card>
  );
};

export default Spreadsheet;