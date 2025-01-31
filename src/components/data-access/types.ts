export type DimensionType = 'product' | 'region' | 'time' | 'version' | 'datasource' | 'layer';

export type AccessLevel = 'read' | 'write' | 'admin';

export interface DimensionOption {
  id: string;
  dimension_name: string;
}

export interface DimensionMember {
  id: string;
  dimension_name: string;
  identifier: string;
  description: string | null;
  attributes: Record<string, any> | null;
}

// Type for table names to ensure they match Supabase schema
export type DimensionTableName = `m_u_${DimensionType}`;