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
  } | null;
  created_at?: string;
  updated_at?: string;
  unique_identifier: string | null;
}