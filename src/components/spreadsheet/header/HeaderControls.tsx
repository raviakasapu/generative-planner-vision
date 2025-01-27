import React from 'react';
import { Button } from "@/components/ui/button";
import { GripHorizontal } from "lucide-react";

interface HeaderControlsProps {
  field: string;
  sortOrder: 'asc' | 'desc' | null;
  onSortChange: () => void;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  field,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>{field}</span>
      <div className="flex items-center gap-2">
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onSortChange}
        >
          {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '↕'}
        </Button>
      </div>
    </div>
  );
};

export default HeaderControls;