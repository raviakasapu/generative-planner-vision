import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
  onAddColumn: () => void;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  field,
  config,
  onConfigUpdate,
  onAddColumn,
}) => {
  return (
    <th className="p-2 border-b">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium cursor-help">{config.label || field}</span>
            </TooltipTrigger>
            <TooltipContent>
              {config.description && <p className="text-sm text-muted-foreground">{config.description}</p>}
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddColumn}
            className="h-6 w-6"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Input
          placeholder="Filter..."
          value={config.filter || ''}
          onChange={(e) => onConfigUpdate({ filter: e.target.value })}
          className="w-full h-8"
        />
      </div>
    </th>
  );
};

export default DataTableHeader;