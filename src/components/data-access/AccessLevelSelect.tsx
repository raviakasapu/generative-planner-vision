import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccessLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AccessLevelSelect: React.FC<AccessLevelSelectProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select access level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="read">Read</SelectItem>
        <SelectItem value="write">Write</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};