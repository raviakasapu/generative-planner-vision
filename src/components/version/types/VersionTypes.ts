export type VersionStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
export type VersionType = 'budget' | 'forecast' | 'actual';

export interface Version {
  id: string;
  dimension_name: string;
  dimension_type: string;
  identifier: string;
  description: string | null;
  attributes: {
    version_type: VersionType;
    version_status: VersionStatus;
    is_base_version: boolean;
    base_version_id: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}