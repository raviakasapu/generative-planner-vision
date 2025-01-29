export type ColumnType = 'dimension' | 'measure';
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';
export type SortOrder = 'asc' | 'desc' | null;
export type FilterOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';

export interface ColumnConfig {
  field: string;
  type: ColumnType;
  label?: string;
  description?: string;
  aggregation?: AggregationType;
  filter: string;
  filterOperator?: FilterOperator;
  sortOrder: SortOrder;
  selectedColumn: string;
  dimensionAttributes?: string[];
}

export interface NewColumnConfig {
  label: string;
  type: ColumnType;
  description?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}