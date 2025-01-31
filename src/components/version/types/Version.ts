import { VersionAttributes } from './VersionAttributes';

export interface Version {
  id: string;
  dimension_name: string;
  dimension_type: string;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes: VersionAttributes | null;
  created_at?: string;
  updated_at?: string;
  unique_identifier: string | null;
}