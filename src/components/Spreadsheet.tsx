import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlanningData {
  id: string;
  dimension1_id: string | null;
  dimension2_id: string | null;
  measure1: number | null;
  measure2: number | null;
}

const Spreadsheet = () => {
  const [data, setData] = useState<PlanningData[]>([]);
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
          dimension1:masterdimension1(product_id, product_description),
          dimension2:masterdimension2(region_id, region_description)
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

  const handleCellChange = async (rowIndex: number, colIndex: number, value: string) => {
    try {
      const row = data[rowIndex];
      if (!row) return;

      let updateData: any = {};
      
      // Determine which measure to update based on column index
      if (colIndex >= 2) { // Skip dimension columns
        const measureField = `measure${colIndex - 1}`;
        updateData[measureField] = parseFloat(value) || null;
      }

      const { error } = await supabase
        .from('planningdata')
        .update(updateData)
        .eq('id', row.id);

      if (error) throw error;

      // Update local state
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

  return (
    <Card className="w-full h-[600px] overflow-auto">
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-muted font-medium text-left">Product</th>
              <th className="border p-2 bg-muted font-medium text-left">Region</th>
              <th className="border p-2 bg-muted font-medium text-left">Measure 1</th>
              <th className="border p-2 bg-muted font-medium text-left">Measure 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="border p-2">
                  {row.dimension1?.product_id || 'N/A'}
                </td>
                <td className="border p-2">
                  {row.dimension2?.region_id || 'N/A'}
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                    value={row.measure1 || ''}
                    onChange={(e) => handleCellChange(rowIndex, 2, e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                    value={row.measure2 || ''}
                    onChange={(e) => handleCellChange(rowIndex, 3, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Spreadsheet;