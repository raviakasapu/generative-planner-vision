export type DimensionMapping = {
  table: string;
  businessIdField: string;
  attributes: string[];
  label: string;
};

export const DIMENSION_MAPPINGS: Record<string, DimensionMapping> = {
  time_dimension_id: {
    table: 'mastertimedimension',
    businessIdField: 'month_id',
    attributes: ['month_id', 'quarter', 'year'],
    label: 'Time Period'
  },
  version_dimension_id: {
    table: 'masterversiondimension',
    businessIdField: 'version_id',
    attributes: ['version_id', 'version_type', 'version_status'],
    label: 'Version'
  },
  datasource_dimension_id: {
    table: 'masterdatasourcedimension',
    businessIdField: 'datasource_id',
    attributes: ['datasource_id', 'datasource_type', 'system_of_origin'],
    label: 'Data Source'
  },
  dimension1_id: {
    table: 'masterdimension1',
    businessIdField: 'product_id',
    attributes: ['product_id', 'product_description', 'category', 'hierarchy_level'],
    label: 'Product'
  },
  dimension2_id: {
    table: 'masterdimension2',
    businessIdField: 'region_id',
    attributes: ['region_id', 'region_description', 'country', 'sales_manager'],
    label: 'Region'
  }
};