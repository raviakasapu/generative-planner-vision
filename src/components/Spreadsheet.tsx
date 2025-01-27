import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Table } from "lucide-react";

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
}

const Spreadsheet = () => {
  const [data, setData] = useState<PlanningData[]>([]);
  const [viewType, setViewType] = useState<'table' | 'pivot'>('table');
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    dimension1_id: { field: 'dimension1_id', type: 'dimension', filter: '', sortOrder: null },
    dimension2_id: { field: 'dimension2_id', type: 'dimension', filter: '', sortOrder: null },
    measure1: { field: 'measure1', type: 'measure', filter: '', sortOrder: null },
    measure2: { field: 'measure2', type: 'measure', filter: '', sortOrder: null },
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlanningData();
  }, []);

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

  const handleColumnConfigChange = (field: string, type: ColumnConfig['type']) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: { ...prev[field], type }
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: { ...prev[field], filter: value }
    }));
  };

  const toggleSort = (field: string) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        sortOrder: prev[field].sortOrder === 'asc' ? 'desc' : 'asc'
      }
    }));
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Object.entries(columnConfigs).map(([field, config]) => (
                <th key={field} className="border p-2 bg-muted font-medium">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{field}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSort(field)}
                      >
                        {config.sortOrder === 'asc' ? '↑' : config.sortOrder === 'desc' ? '↓' : '↕'}
                      </Button>
                    </div>
                    <Select
                      value={config.type}
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
                      value={config.filter}
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
                {Object.keys(columnConfigs).map((field) => (
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
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Spreadsheet;