import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DimensionForm } from './master-data/DimensionForm';
import { DimensionTable } from './master-data/DimensionTable';
import { SearchAndPagination } from './master-data/SearchAndPagination';
import { Dimension, NewDimension, DimensionType } from './master-data/types';

const MasterData = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [newDimension, setNewDimension] = useState<NewDimension>({ 
    id: "", 
    name: "", 
    type: "product",
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
    if (showData) {
      fetchDimensions();
    }
  }, [showData, newDimension.type]);

  const fetchDimensions = async () => {
    try {
      let data: Dimension[] = [];
      
      switch(newDimension.type) {
        case 'product':
          const { data: products, error: productsError } = await supabase
            .from('masterproductdimension')
            .select('*')
            .order('created_at', { ascending: false });
          if (productsError) throw productsError;
          data = products.map(p => ({
            ...p,
            dimension_type: 'product' as DimensionType,
            product_id: p.product_id || '',
            product_description: p.product_description || '',
            category: p.category || ''
          }));
          break;
          
        case 'region':
          const { data: regions, error: regionsError } = await supabase
            .from('masterregiondimension')
            .select('*')
            .order('created_at', { ascending: false });
          if (regionsError) throw regionsError;
          data = regions.map(r => ({
            ...r,
            dimension_type: 'region' as DimensionType,
            region_id: r.region_id || '',
            region_description: r.region_description || '',
            country: r.country || ''
          }));
          break;
          
        case 'datasource':
          const { data: datasources, error: datasourcesError } = await supabase
            .from('masterdatasourcedimension')
            .select('*')
            .order('created_at', { ascending: false });
          if (datasourcesError) throw datasourcesError;
          data = datasources.map(d => ({
            ...d,
            dimension_type: 'datasource' as DimensionType,
            datasource_id: d.datasource_id || '',
            datasource_name: d.datasource_name || '',
            datasource_description: d.datasource_description || '',
            datasource_type: d.datasource_type || '',
            system_of_origin: d.system_of_origin || ''
          }));
          break;
      }
      
      setDimensions(data);
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
      const currentType = newDimension.type;
      const table = currentType === 'product' ? 'masterproductdimension' :
                    currentType === 'region' ? 'masterregiondimension' :
                    'masterdatasourcedimension';
      
      const insertData = currentType === 'product' ? {
        product_id: newDimension.id,
        product_description: newDimension.name,
        category: newDimension.category,
        dimension_name: 'Products'
      } : currentType === 'region' ? {
        region_id: newDimension.id,
        region_description: newDimension.name,
        country: newDimension.category,
        dimension_name: 'Regions'
      } : {
        datasource_id: newDimension.id,
        datasource_name: newDimension.name,
        datasource_description: newDimension.description,
        datasource_type: newDimension.category,
        system_of_origin: newDimension.systemOrigin,
        dimension_name: 'Data Source'
      };
      
      const { data, error } = await supabase
        .from(table)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setDimensions(prev => [...prev, { ...data, dimension_type: currentType }]);
      setNewDimension({ 
        id: "", 
        name: "", 
        type: currentType,
        description: "", 
        category: "", 
        systemOrigin: "" 
      });
      
      toast({
        title: "Success",
        description: `${newDimension.name} has been added successfully to ${currentType} master data.`,
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
      const table = editingDimension.dimension_type === 'product' ? 'masterproductdimension' :
                    editingDimension.dimension_type === 'region' ? 'masterregiondimension' :
                    'masterdatasourcedimension';
      
      const updateData = editingDimension.dimension_type === 'product' ? {
        product_id: editingDimension.product_id,
        product_description: editingDimension.product_description,
        category: editingDimension.category,
      } : editingDimension.dimension_type === 'region' ? {
        region_id: editingDimension.region_id,
        region_description: editingDimension.region_description,
        country: editingDimension.country,
      } : {
        datasource_id: editingDimension.datasource_id,
        datasource_name: editingDimension.datasource_name,
        datasource_description: editingDimension.datasource_description,
        datasource_type: editingDimension.datasource_type,
        system_of_origin: editingDimension.system_of_origin,
      };

      const { error } = await supabase
        .from(table)
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
    switch(dim.dimension_type) {
      case 'product':
        return dim.product_id?.toLowerCase().includes(searchString) ||
               dim.product_description?.toLowerCase().includes(searchString);
      case 'region':
        return dim.region_id?.toLowerCase().includes(searchString) ||
               dim.region_description?.toLowerCase().includes(searchString);
      case 'datasource':
        return dim.datasource_id?.toLowerCase().includes(searchString) ||
               dim.datasource_description?.toLowerCase().includes(searchString);
      default:
        return false;
    }
  });

  const paginatedDimensions = filteredDimensions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDimensions.length / itemsPerPage);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Master Data Management</h2>
      <div className="space-y-4">
        <DimensionForm
          newDimension={newDimension}
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
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              selectedType={newDimension.type}
            />

            <DimensionTable
              dimensions={paginatedDimensions}
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
