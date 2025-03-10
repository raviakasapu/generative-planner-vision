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
      if (!user?.id) return [];

      let query = supabase
        .from('t_planneddata')
        .select(`
          *,
          m_u_product (
            id,
            identifier,
            description,
            hierarchy,
            attributes
          ),
          m_u_region (
            id,
            identifier,
            description,
            attributes
          ),
          m_u_time (
            id,
            identifier,
            description,
            attributes
          ),
          m_u_version (
            id,
            identifier,
            description,
            attributes
          ),
          m_u_datasource (
            id,
            identifier,
            description,
            attributes
          )
        `);

      if (sortConfig.column) {
        query = query.order(sortConfig.column, {
          ascending: sortConfig.direction === 'asc'
        });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching planning data:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  const filteredData = planningData?.filter(row => {
    if (!row) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      row.m_u_product?.description?.toLowerCase().includes(searchLower) ||
      row.m_u_region?.description?.toLowerCase().includes(searchLower) ||
      row.m_u_time?.description?.toLowerCase().includes(searchLower) ||
      row.m_u_version?.description?.toLowerCase().includes(searchLower) ||
      row.m_u_datasource?.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleSort = (column: string) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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
                  onClick={() => handleSort('m_u_time.description')}
                  className="flex items-center gap-1"
                >
                  Time
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('m_u_product.description')}
                  className="flex items-center gap-1"
                >
                  Product
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('m_u_region.description')}
                  className="flex items-center gap-1"
                >
                  Region
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('m_u_version.description')}
                  className="flex items-center gap-1"
                >
                  Version
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('m_u_datasource.description')}
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
                  {row.m_u_time?.description}
                </TableCell>
                <TableCell>
                  {row.m_u_product?.description}
                </TableCell>
                <TableCell>
                  {row.m_u_region?.description}
                </TableCell>
                <TableCell>
                  {row.m_u_version?.description}
                </TableCell>
                <TableCell>
                  {row.m_u_datasource?.description}
                </TableCell>
                <TableCell className="text-right">
                  {row.measure1?.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {row.measure2?.toLocaleString()}
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
