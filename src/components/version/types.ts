export interface Version {
  id: string;
  dimension_name: string;
  dimension_type: string;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes: {
    version_type: string;
    version_status: string;
    base_version_id: string | null;
    is_base_version: boolean;
  };
  created_at: string;
  updated_at: string;
  owner_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  unique_identifier: string | null;
}

export interface VersionFormData {
  versionName: string;
  versionDescription: string;
  versionType: string;
  isBaseVersion: boolean;
  baseVersionId: string | null;
  ownerId: string | null;
}