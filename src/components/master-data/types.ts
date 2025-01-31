export type DimensionType = 'product' | 'region' | 'datasource' | 'time' | 'version';

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes?: any;
  created_at?: string;
  updated_at?: string;
  // Product specific
  product_id?: string;
  product_description?: string;
  category?: string;
  // Region specific
  region_id?: string;
  region_description?: string;
  country?: string;
  // Datasource specific
  datasource_id?: string;
  datasource_description?: string;
  datasource_type?: string;
  system_of_origin?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  hierarchy?: string;
  attributes?: any;
  category?: string;
  systemOrigin?: string;
  salesManager?: string;
}