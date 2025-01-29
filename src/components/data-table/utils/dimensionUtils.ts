import { DIMENSION_MAPPINGS } from '../types/dimension';

export const getDimensionInfo = (field: string) => {
  // Handle attribute columns (e.g., dimension1_category)
  if (field.includes('_')) {
    const [baseDimension, ...attributeParts] = field.split('_');
    const attributeName = attributeParts.join('_');
    const baseField = Object.keys(DIMENSION_MAPPINGS).find(key => key.startsWith(baseDimension));
    
    if (baseField && DIMENSION_MAPPINGS[baseField]) {
      return {
        table: DIMENSION_MAPPINGS[baseField].table,
        businessIdField: attributeName,
        isAttribute: true
      };
    }
  }

  // Handle base dimension columns
  if (DIMENSION_MAPPINGS[field]) {
    return {
      table: DIMENSION_MAPPINGS[field].table,
      businessIdField: DIMENSION_MAPPINGS[field].businessIdField,
      isAttribute: false
    };
  }

  return null;
};

export const getDimensionValue = (row: any, field: string): string => {
  const dimensionInfo = getDimensionInfo(field);
  
  if (!dimensionInfo) {
    return String(row[field] || '');
  }

  const { table, businessIdField } = dimensionInfo;
  const dimensionData = row[table];

  if (!dimensionData) {
    console.log(`No dimension data found for field: ${field}`);
    console.log(`${table} data:`, dimensionData);
    console.log('Row data:', row);
    return '-';
  }

  const value = dimensionData[businessIdField];
  return value !== null && value !== undefined ? String(value) : '-';
};

export const getDimensionAttributes = (field: string, row: any) => {
  const baseField = field.includes('_') 
    ? Object.keys(DIMENSION_MAPPINGS).find(key => field.startsWith(key.split('_')[0]))
    : field;

  if (!baseField || !DIMENSION_MAPPINGS[baseField]) {
    return null;
  }

  const { table, attributes } = DIMENSION_MAPPINGS[baseField];
  const dimensionData = row[table];

  if (!dimensionData) {
    return null;
  }

  return attributes.map(attr => ({
    label: attr,
    value: dimensionData[attr] || '-'
  }));
};