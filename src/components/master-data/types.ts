export type DimensionType = 'product' | 'region' | 'datasource';

export interface Dimension {
  id: string;
  dimension_name: string;
  product_id?: string;
  region_id?: string;
  datasource_id?: string;
  product_description?: string;
  region_description?: string;
  datasource_description?: string;
  category?: string;
  country?: string;
  hierarchy_level?: string;
  datasource_type?: string;
  system_of_origin?: string;
  dimension_type: DimensionType;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  category: string;
  systemOrigin: string;
}