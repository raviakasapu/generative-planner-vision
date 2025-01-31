export interface VersionAttributes {
  version_type: string;
  version_status: string;
  base_version_id: string | null;
  is_base_version: boolean;
}

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

export type VersionType = 'budget' | 'forecast' | 'actual';

export interface VersionFormData {
  versionName: string;
  versionDescription: string;
  versionType: VersionType | '';
  isBaseVersion: boolean;
  baseVersionId: string | null;
}