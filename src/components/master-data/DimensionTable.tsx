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
                    value={editingDimension[`${dim.dimension_type}_id`] || ''}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [`${dim.dimension_type}_id`]: e.target.value
                    })}
                  />
                ) : (
                  dim.product_id || dim.region_id || dim.datasource_id
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={editingDimension[`${dim.dimension_type}_description`] || ''}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [`${dim.dimension_type}_description`]: e.target.value
                    })}
                  />
                ) : (
                  dim.product_description || dim.region_description || dim.datasource_description
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={editingDimension.category || editingDimension.country || editingDimension.datasource_type || ''}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      [dim.dimension_type === 'product' ? 'category' : 
                       dim.dimension_type === 'region' ? 'country' : 
                       'datasource_type']: e.target.value
                    })}
                  />
                ) : (
                  dim.category || dim.country || dim.datasource_type
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