export type DimensionType = 'product' | 'region' | 'datasource';

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  unique_identifier: string | null;
  description: string | null;
  hierarchy: string | null;
  attributes?: any;
  attributes1?: string | null; // For product dimension
  created_at?: string;
  updated_at?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  category?: string;
  systemOrigin?: string;
}