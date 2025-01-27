export interface PlanningData {
  id: string;
  dimension1_id: string | null;
  dimension2_id: string | null;
  measure1: number | null;
  measure2: number | null;
  masterdimension1?: {
    id: string;
    product_id: string;
    product_description: string;
    category: string;
    hierarchy_level: string;
  };
  masterdimension2?: {
    id: string;
    region_id: string;
    region_description: string;
    country: string;
    sales_manager: string;
  };
}

export type ColumnType = 'dimension' | 'measure';
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';
export type SortOrder = 'asc' | 'desc' | null;

export interface ColumnConfig {
  field: string;
  type: ColumnType;
  aggregation?: AggregationType;
  filter: string;
  sortOrder: SortOrder;
  selectedColumn: string;
}

export interface DimensionColumn {
  value: string;
  label: string;
}