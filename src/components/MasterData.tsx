import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DimensionForm } from './master-data/DimensionForm';
import { DimensionTable } from './master-data/DimensionTable';
import { SearchAndPagination } from './master-data/SearchAndPagination';
import { Dimension, NewDimension, DimensionType, DimensionTypeMetadata, DimensionData } from './master-data/types';

const MasterData = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [dimensionTypes, setDimensionTypes] = useState<DimensionTypeMetadata[]>([]);
  const [newDimension, setNewDimension] = useState<NewDimension>({ 
    id: "", 
    name: "", 
    type: "",
    description: "",
    category: "",
    systemOrigin: "",
  });
  const [showData, setShowData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDimension, setEditingDimension] = useState<Dimension | null>(null);
  const itemsPerPage = 5;
  const { toast } = useToast();

  useEffect(() => {
    fetchDimensionTypes();
  }, []);

  useEffect(() => {
    if (showData && newDimension.type) {
      fetchDimensions();
    }
  }, [showData, newDimension.type]);

  const fetchDimensionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('table_dimension_types')
        .select('*')
        .eq('table_name', 'm_u_%');

      if (error) throw error;

      const types: DimensionTypeMetadata[] = data.map(type => ({
        id: type.id,
        name: type.name,
        description: type.description,
        table_name: type.table_name,
        attributes: type.attributes || {}
      }));

      setDimensionTypes(types);
      if (types.length > 0 && !newDimension.type) {
        setNewDimension(prev => ({ ...prev, type: types[0].table_name.replace('m_u_', '') }));
      }
    } catch (error) {
      console.error('Error fetching dimension types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dimension types",
        variant: "destructive",
      });
    }
  };

  const fetchDimensions = async () => {
    try {
      const tableName = `m_u_${newDimension.type}`;
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;

      const formattedData: Dimension[] = (data as DimensionData[]).map(item => ({
        id: item.id,
        dimension_name: item.dimension_name || '',
        dimension_type: newDimension.type as DimensionType,
        identifier: item.identifier,
        description: item.description,
        hierarchy: item.hierarchy,
        attributes: item.attributes || {},
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setDimensions(formattedData);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch master data",
        variant: "destructive",
      });
    }
  };

  const handleAddDimension = async () => {
    if (!newDimension.id || !newDimension.name) {
      toast({
        title: "Validation Error",
        description: "ID and Name are required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const tableName = `m_u_${newDimension.type}`;
      const currentDimensionType = dimensionTypes.find(
        type => type.table_name === tableName
      );
      
      const insertData = {
        identifier: newDimension.id,
        description: newDimension.name,
        dimension_type: newDimension.type,
        attributes: currentDimensionType?.attributes || {}
      };
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const newDimensionData: Dimension = {
        id: data.id,
        dimension_name: data.dimension_name || '',
        dimension_type: newDimension.type,
        identifier: data.identifier,
        description: data.description,
        hierarchy: data.hierarchy,
        attributes: data.attributes || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setDimensions(prev => [...prev, newDimensionData]);
      setNewDimension({ 
        id: "", 
        name: "", 
        type: newDimension.type,
        description: "", 
        category: "", 
        systemOrigin: "" 
      });
      
      toast({
        title: "Success",
        description: `${newDimension.name} has been added successfully to ${newDimension.type} master data.`,
      });
    } catch (error) {
      console.error('Error adding dimension:', error);
      toast({
        title: "Error",
        description: `Failed to add master data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateDimension = async () => {
    if (!editingDimension) return;

    try {
      const tableName = `m_u_${editingDimension.dimension_type}`;
      
      const updateData = {
        identifier: editingDimension.identifier,
        description: editingDimension.description,
        attributes: editingDimension.attributes,
      };

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', editingDimension.id);

      if (error) throw error;

      setDimensions(prev => 
        prev.map(dim => dim.id === editingDimension.id ? editingDimension : dim)
      );
      setEditingDimension(null);
      
      toast({
        title: "Success",
        description: "Master data updated successfully",
      });
    } catch (error) {
      console.error('Error updating dimension:', error);
      toast({
        title: "Error",
        description: `Failed to update master data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filteredDimensions = dimensions.filter(dim => {
    const searchString = searchTerm.toLowerCase();
    return dim.identifier?.toLowerCase().includes(searchString) ||
           dim.description?.toLowerCase().includes(searchString);
  });

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Master Data Management</h2>
      
      <div className="space-y-4">
        <DimensionForm
          newDimension={newDimension}
          dimensionTypes={dimensionTypes}
          onDimensionChange={(updates) => setNewDimension(prev => ({ ...prev, ...updates }))}
          onSubmit={handleAddDimension}
        />
        
        <div className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => {
              setShowData(!showData);
              if (!showData) fetchDimensions();
            }}
          >
            {showData ? 'Hide Master Data' : 'Show Master Data'}
          </Button>
        </div>

        {showData && (
          <>
            <SearchAndPagination
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              currentPage={currentPage}
              totalPages={Math.ceil(dimensions.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              selectedType={newDimension.type}
            />

            <DimensionTable
              dimensions={dimensions.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )}
              selectedType={newDimension.type}
              editingDimension={editingDimension}
              onEdit={setEditingDimension}
              onUpdate={handleUpdateDimension}
              onCancelEdit={() => setEditingDimension(null)}
              onEditingChange={setEditingDimension}
            />
          </>
        )}
      </div>
    </Card>
  );
};

export default MasterData;
