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
                    value={editingDimension.identifier}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      identifier: e.target.value
                    })}
                  />
                ) : (
                  dim.identifier
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={editingDimension.description || ''}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      description: e.target.value
                    })}
                  />
                ) : (
                  dim.description
                )}
              </TableCell>
              <TableCell>
                {editingDimension?.id === dim.id ? (
                  <Input
                    value={editingDimension.attributes?.country || 
                           editingDimension.attributes?.datasource_type || 
                           editingDimension.attributes || ''}
                    onChange={(e) => {
                      const updatedDimension = { ...editingDimension };
                      if (selectedType === 'region') {
                        updatedDimension.attributes = { country: e.target.value };
                      } else if (selectedType === 'datasource') {
                        updatedDimension.attributes = {
                          ...updatedDimension.attributes,
                          datasource_type: e.target.value
                        };
                      } else {
                        updatedDimension.attributes = e.target.value;
                      }
                      onEditingChange(updatedDimension);
                    }}
                  />
                ) : (
                  selectedType === 'region' ? dim.attributes?.country :
                  selectedType === 'datasource' ? dim.attributes?.datasource_type :
                  dim.attributes
                )}
              </TableCell>
              {selectedType === 'datasource' && (
                <TableCell>
                  {editingDimension?.id === dim.id ? (
                    <Input
                      value={editingDimension.attributes?.system_of_origin || ''}
                      onChange={(e) => onEditingChange({
                        ...editingDimension,
                        attributes: {
                          ...editingDimension.attributes,
                          system_of_origin: e.target.value
                        }
                      })}
                    />
                  ) : (
                    dim.attributes?.system_of_origin
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