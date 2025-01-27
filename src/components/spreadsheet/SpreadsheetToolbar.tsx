import React from 'react';
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface SpreadsheetToolbarProps {
  viewType: 'table' | 'pivot';
  showTotals: boolean;
  onViewTypeChange: (type: 'table' | 'pivot') => void;
  onShowTotalsChange: (show: boolean) => void;
}

const SpreadsheetToolbar: React.FC<SpreadsheetToolbarProps> = ({
  viewType,
  showTotals,
  onViewTypeChange,
  onShowTotalsChange,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Planning Data</h2>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onViewTypeChange('table')}>
            Table View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewTypeChange('pivot')}>
            Pivot View
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={showTotals}
            onCheckedChange={onShowTotalsChange}
          >
            Show Totals
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SpreadsheetToolbar;