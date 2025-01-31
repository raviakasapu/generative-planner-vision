import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DimensionType } from "./types";

interface DimensionTypeSelectProps {
  value: DimensionType | '';
  onChange: (value: DimensionType) => void;
}

export const DimensionTypeSelect: React.FC<DimensionTypeSelectProps> = ({ value, onChange }) => {
  return (
    <Select 
      value={value}
      onValueChange={(value: DimensionType) => onChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select dimension type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="product">Product Dimension</SelectItem>
        <SelectItem value="region">Region Dimension</SelectItem>
        <SelectItem value="time">Time Dimension</SelectItem>
        <SelectItem value="version">Version Dimension</SelectItem>
        <SelectItem value="datasource">Data Source Dimension</SelectItem>
        <SelectItem value="layer">Layer Dimension</SelectItem>
      </SelectContent>
    </Select>
  );
};