import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DimensionType } from './types';

interface DimensionTypeSelectProps {
  value: DimensionType | '';
  onChange: (value: DimensionType) => void;
}

export const DimensionTypeSelect: React.FC<DimensionTypeSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select dimension type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="product">Product</SelectItem>
        <SelectItem value="region">Region</SelectItem>
        <SelectItem value="time">Time</SelectItem>
        <SelectItem value="version">Version</SelectItem>
        <SelectItem value="datasource">Data Source</SelectItem>
        <SelectItem value="layer">Layer</SelectItem>
      </SelectContent>
    </Select>
  );
};