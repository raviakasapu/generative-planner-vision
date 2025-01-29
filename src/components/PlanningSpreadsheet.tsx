import React, { useState } from 'react';
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
import { Loader2, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

type SortConfig = {
  column: string | null;
  direction: 'asc' | 'desc';
};

const PlanningSpreadsheet = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: 'asc'
  });

  const { data: planningData, isLoading } = useQuery({
    queryKey: ['planningData', user?.id, sortConfig],
    queryFn: async () => {
      // First, get user's dimension access permissions
      const { data: permissions } = await supabase
        .from('data_access_permissions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('approval_status', 'approved');

      const dimension1Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension1')
        .map(p => p.dimension_id);
      const dimension2Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension2')
        .map(p => p.dimension_id);

      let query = supabase
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

      // Apply dimension access filters
      if (dimension1Ids?.length) {
        query = query.in('dimension1_id', dimension1Ids);
      }
      if (dimension2Ids?.length) {
        query = query.in('dimension2_id', dimension2Ids);
      }

      // Apply sorting if configured
      if (sortConfig.column) {
        query = query.order(sortConfig.column, {
          ascending: sortConfig.direction === 'asc'
        });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredData = planningData?.filter(row => {
    const searchLower = searchTerm.toLowerCase();
    return (
      row.masterdimension1?.product_description?.toLowerCase().includes(searchLower) ||
      row.masterdimension2?.region_description?.toLowerCase().includes(searchLower) ||
      row.mastertimedimension?.month_name?.toLowerCase().includes(searchLower) ||
      row.masterversiondimension?.version_name?.toLowerCase().includes(searchLower) ||
      row.masterdatasourcedimension?.datasource_name?.toLowerCase().includes(searchLower)
    );
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Planning Data</h2>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('mastertimedimension.month_name')}
                  className="flex items-center gap-1"
                >
                  Time
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('masterdimension1.product_description')}
                  className="flex items-center gap-1"
                >
                  Product
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('masterdimension2.region_description')}
                  className="flex items-center gap-1"
                >
                  Region
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('masterversiondimension.version_name')}
                  className="flex items-center gap-1"
                >
                  Version
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('masterdatasourcedimension.datasource_name')}
                  className="flex items-center gap-1"
                >
                  Data Source
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('measure1')}
                  className="flex items-center gap-1 ml-auto"
                >
                  Measure 1
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('measure2')}
                  className="flex items-center gap-1 ml-auto"
                >
                  Measure 2
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((row) => (
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