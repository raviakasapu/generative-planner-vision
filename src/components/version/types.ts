export type Version = {
  id: string;
  version_id: string;
  version_name: string;
  version_description: string | null;
  version_type: string;
  version_status: string;
  created_at: string;
  is_base_version: boolean;
  base_version_id: string | null;
};