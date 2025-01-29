import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnConfig } from './types';

interface DataTableHeaderProps {
  field: string;
  config: ColumnConfig;
  onConfigUpdate: (updates: Partial<ColumnConfig>) => void;
  onAddColumn: (attributeName: string) => void;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  field,
  config,
  onConfigUpdate,
  onAddColumn,
}) => {
  const getDimensionAttributes = () => {
    if (field === 'dimension1_id') {
      return ['product_id', 'product_description', 'category', 'hierarchy_level'];
    }
    if (field === 'dimension2_id') {
      return ['region_id', 'region_description', 'country', 'sales_manager'];
    }
    return [];
  };

  const dimensionAttributes = getDimensionAttributes();

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Add Attribute Column</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {dimensionAttributes.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Available Attributes
                  </DropdownMenuLabel>
                  {dimensionAttributes.map((attr) => (
                    <DropdownMenuItem key={attr} onSelect={() => onAddColumn(attr)}>
                      {attr}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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