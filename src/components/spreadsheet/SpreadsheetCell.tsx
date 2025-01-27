import React from 'react';
import { Input } from "@/components/ui/input";
import { PlanningData } from './types';

interface SpreadsheetCellProps {
  row: PlanningData;
  field: string;
  value: string | number;
  onChange: (value: string) => void;
}

const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({
  row,
  field,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <td className="p-2 border">
      <Input
        type={field.includes('measure') ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
        className="w-full h-8 px-2"
      />
    </td>
  );
};

export default SpreadsheetCell;