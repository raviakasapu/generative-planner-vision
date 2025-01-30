export type DimensionType = 'product' | 'region' | 'datasource';

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  unique_identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes1: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  identifier: string;
  hierarchy: string;
  attributes1: string;
}