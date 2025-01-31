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
            <TableHead>Hierarchy</TableHead>
            {selectedType === 'product' && (
              <TableHead>Category</TableHead>
            )}
            {selectedType === 'region' && (
              <>
                <TableHead>Country</TableHead>
                <TableHead>Sales Manager</TableHead>
              </>
            )}
            {selectedType === 'datasource' && (
              <>
                <TableHead>Data Source Type</TableHead>
                <TableHead>System of Origin</TableHead>
              </>
            )}
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
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
                    value={editingDimension.hierarchy || ''}
                    onChange={(e) => onEditingChange({
                      ...editingDimension,
                      hierarchy: e.target.value
                    })}
                  />
                ) : (
                  dim.hierarchy
                )}
              </TableCell>
              {selectedType === 'product' && (
                <TableCell>
                  {editingDimension?.id === dim.id ? (
                    <Input
                      value={editingDimension.attributes || ''}
                      onChange={(e) => onEditingChange({
                        ...editingDimension,
                        attributes: e.target.value
                      })}
                    />
                  ) : (
                    dim.attributes
                  )}
                </TableCell>
              )}
              {selectedType === 'region' && (
                <>
                  <TableCell>
                    {editingDimension?.id === dim.id ? (
                      <Input
                        value={editingDimension.attributes?.country || ''}
                        onChange={(e) => onEditingChange({
                          ...editingDimension,
                          attributes: { ...editingDimension.attributes, country: e.target.value }
                        })}
                      />
                    ) : (
                      dim.attributes?.country
                    )}
                  </TableCell>
                  <TableCell>
                    {editingDimension?.id === dim.id ? (
                      <Input
                        value={editingDimension.attributes?.sales_manager || ''}
                        onChange={(e) => onEditingChange({
                          ...editingDimension,
                          attributes: { ...editingDimension.attributes, sales_manager: e.target.value }
                        })}
                      />
                    ) : (
                      dim.attributes?.sales_manager
                    )}
                  </TableCell>
                </>
              )}
              {selectedType === 'datasource' && (
                <>
                  <TableCell>
                    {editingDimension?.id === dim.id ? (
                      <Input
                        value={editingDimension.attributes?.datasource_type || ''}
                        onChange={(e) => onEditingChange({
                          ...editingDimension,
                          attributes: { ...editingDimension.attributes, datasource_type: e.target.value }
                        })}
                      />
                    ) : (
                      dim.attributes?.datasource_type
                    )}
                  </TableCell>
                  <TableCell>
                    {editingDimension?.id === dim.id ? (
                      <Input
                        value={editingDimension.attributes?.system_of_origin || ''}
                        onChange={(e) => onEditingChange({
                          ...editingDimension,
                          attributes: { ...editingDimension.attributes, system_of_origin: e.target.value }
                        })}
                      />
                    ) : (
                      dim.attributes?.system_of_origin
                    )}
                  </TableCell>
                </>
              )}
              <TableCell>{new Date(dim.created_at || '').toLocaleDateString()}</TableCell>
              <TableCell>{new Date(dim.updated_at || '').toLocaleDateString()}</TableCell>
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