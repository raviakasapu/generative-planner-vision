export interface VersionFormData {
  dimension_name: string;
  description: string;
  version_type: string;
  base_version_id?: string | null;
  owner_id?: string | null;
}