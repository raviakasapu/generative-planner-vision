export type DimensionType = 'product' | 'region' | 'datasource' | 'time' | 'version';

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes?: any;
  attributes1?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  attributes?: any;
  attributes1?: string | null;
  category?: string;
  systemOrigin?: string;
}