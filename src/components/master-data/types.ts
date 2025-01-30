export type DimensionType = 'product' | 'region' | 'datasource';

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  unique_identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes: {
    datasource_type?: string;
    system_of_origin?: string;
    parent_datasource_id?: string;
    country?: string;
    sales_manager?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  identifier: string;
  attributes: {
    datasource_type?: string;
    system_of_origin?: string;
    parent_datasource_id?: string;
    country?: string;
    sales_manager?: string;
  };
}