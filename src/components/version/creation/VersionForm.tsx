import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Version, VersionFormData } from '../types/VersionTypes';

interface VersionFormProps {
  formData: VersionFormData;
  onFormChange: (updates: Partial<VersionFormData>) => void;
  existingVersions?: Version[];
}

export const VersionForm: React.FC<VersionFormProps> = ({
  formData,
  onFormChange,
  existingVersions,
}) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Version Name"
        value={formData.versionName}
        onChange={(e) => onFormChange({ versionName: e.target.value })}
      />
      <Textarea
        placeholder="Version Description"
        value={formData.versionDescription}
        onChange={(e) => onFormChange({ versionDescription: e.target.value })}
      />
      <Select 
        value={formData.versionType} 
        onValueChange={(value) => onFormChange({ versionType: value as VersionType })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Version Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="budget">Budget</SelectItem>
          <SelectItem value="forecast">Forecast</SelectItem>
          <SelectItem value="actual">Actual</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isBaseVersion"
          checked={formData.isBaseVersion}
          onCheckedChange={(checked) => onFormChange({ isBaseVersion: checked as boolean })}
        />
        <label
          htmlFor="isBaseVersion"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Is Base Version
        </label>
      </div>

      {!formData.isBaseVersion && (
        <Select 
          value={formData.baseVersionId || ''} 
          onValueChange={(value) => onFormChange({ baseVersionId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Base Version (Optional)" />
          </SelectTrigger>
          <SelectContent>
            {existingVersions?.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.dimension_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};