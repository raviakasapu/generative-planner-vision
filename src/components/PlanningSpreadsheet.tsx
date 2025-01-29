import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const PlanningSpreadsheet = () => {
  const { data: planningData, isLoading } = useQuery({
    queryKey: ['planningData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planningdata')
        .select(`
          *,
          masterdimension1 (
            product_id,
            product_description,
            category
          ),
          masterdimension2 (
            region_id,
            region_description,
            country
          ),
          mastertimedimension (
            month_id,
            month_name,
            year
          ),
          masterversiondimension (
            version_id,
            version_name
          ),
          masterdatasourcedimension (
            datasource_id,
            datasource_name
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Planning Data</h2>
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Data Source</TableHead>
              <TableHead className="text-right">Measure 1</TableHead>
              <TableHead className="text-right">Measure 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planningData?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.mastertimedimension?.month_name} {row.mastertimedimension?.year}
                </TableCell>
                <TableCell>
                  {row.masterdimension1?.product_description || 'N/A'}
                </TableCell>
                <TableCell>
                  {row.masterdimension2?.region_description || 'N/A'}
                </TableCell>
                <TableCell>
                  {row.masterversiondimension?.version_name || 'N/A'}
                </TableCell>
                <TableCell>
                  {row.masterdatasourcedimension?.datasource_name || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {row.measure1?.toLocaleString() || '-'}
                </TableCell>
                <TableCell className="text-right">
                  {row.measure2?.toLocaleString() || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default PlanningSpreadsheet;