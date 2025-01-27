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

export interface ColumnConfig {
  field: string;
  type: 'dimension' | 'attribute' | 'hierarchy' | 'measure' | 'sum' | 'avg' | 'min' | 'max' | 'count';
  filter: string;
  sortOrder: 'asc' | 'desc' | null;
  order: number;
  selectedColumn?: string;
}