import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dimension } from './types';

interface DimensionTableProps {
  dimensions: Dimension[];
  selectedType: string;
  editingDimension: Dimension | null;
  onEdit: (dimension: Dimension) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onEditingChange: (dimension: Dimension) => void;
}

export const DimensionTable = ({
  dimensions,
  selectedType,
  editingDimension,
  onEdit,
  onUpdate,
  onCancelEdit,
  onEditingChange,
}: DimensionTableProps) => {
  const getDimensionId = (dim: Dimension) => {
    switch (dim.dimension_type) {
      case 'product':
        return dim.product_id;
      case 'region':
        return dim.region_id;
      case 'datasource':
        return dim.datasource_id;
      default:
        return '';
    }
  };

  const getDimensionDescription = (dim: Dimension) => {
    switch (dim.dimension_type) {
      case 'product':
        return dim.product_description;
      case 'region':
        return dim.region_description;
      case 'datasource':
        return dim.datasource_description;
      default:
        return '';
    }
  };

  const getCategoryValue = (dim: Dimension) => {
    switch (dim.dimension_type) {
      case 'product':
        return dim.category;
      case 'region':
        return dim.country;
      case 'datasource':
        return dim.datasource_type;
      default:
        return '';
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name/Description</TableHead>
            <TableHead>Category/Country/Type</TableHead>
            {selectedType === 'datasource' && (
              <TableHead>System of Origin</TableHead>
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dimensions.map((dim) => (
            <TableRow key={dim.id}>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={getDimensionId(editingDimension)}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [`${dim.dimension_type}_id`]: e.target.value
                    })}
                  />
                ) : (
                  getDimensionId(dim)
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={getDimensionDescription(editingDimension)}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [`${dim.dimension_type}_description`]: e.target.value
                    })}
                  />
                ) : (
                  getDimensionDescription(dim)
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={getCategoryValue(editingDimension)}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [dim.dimension_type === 'product' ? 'category' : 
                       dim.dimension_type === 'region' ? 'country' : 
                       'datasource_type']: e.target.value
                    })}
                  />
                ) : (
                  getCategoryValue(dim)
                )}
              </TableCell>
              {selectedType === 'datasource' && (
                <TableCell>
                  {editingDimension?.id === dim.id ? (
                    <Input
                      value={editingDimension.system_of_origin || ''}
                      onChange={(e) => onEditingChange({
                        ...editingDimension,
                        system_of_origin: e.target.value
                      })}
                    />
                  ) : (
                    dim.system_of_origin
                  )}
                </TableCell>
              )}
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <div className="space-x-2">
                    <Button onClick={onUpdate} size="sm">Save</Button>
                    <Button onClick={onCancelEdit} variant="outline" size="sm">Cancel</Button>
                  </div>
                ) : (
                  <Button onClick={() => onEdit(dim)} variant="outline" size="sm">Edit</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};