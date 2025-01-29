import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnConfig } from './types';

interface DataTableHeaderProps {
  field: string;
  config: ColumnConfig;
  onConfigUpdate: (updates: Partial<ColumnConfig>) => void;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  field,
  config,
  onConfigUpdate,
}) => {
  return (
    <th className="p-2 border bg-muted">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium cursor-help">{config.label || field}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to sort</p>
              {config.description && <p className="text-sm text-muted-foreground">{config.description}</p>}
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onConfigUpdate({
              sortOrder: config.sortOrder === 'asc' ? 'desc' : 
                        config.sortOrder === 'desc' ? null : 'asc'
            })}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {config.type === 'measure' && (
          <Select
            value={config.aggregation}
            onValueChange={(value: any) => onConfigUpdate({ aggregation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="avg">Average</SelectItem>
              <SelectItem value="min">Minimum</SelectItem>
              <SelectItem value="max">Maximum</SelectItem>
              <SelectItem value="count">Count</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder="Filter..."
          value={config.filter || ''}
          onChange={(e) => onConfigUpdate({ filter: e.target.value })}
          className="w-full"
        />
      </div>
    </th>
  );
};

export default DataTableHeader;