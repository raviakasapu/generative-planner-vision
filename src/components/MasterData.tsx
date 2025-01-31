import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DimensionForm } from './master-data/DimensionForm';
import { DimensionTable } from './master-data/DimensionTable';
import { SearchAndPagination } from './master-data/SearchAndPagination';
import { Dimension, NewDimension, DimensionType } from './master-data/types';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

const MasterData = () => {
  const navigate = useNavigate();
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
            .from('m_u_product')
            .select('*');
          if (productsError) throw productsError;
          data = products.map(p => ({
            ...p,
            id: p.id,
            identifier: p.identifier,
            description: p.description,
            dimension_type: 'product' as DimensionType,
            attributes: p.attributes || null,
          }));
          break;
          
        case 'region':
          const { data: regions, error: regionsError } = await supabase
            .from('m_u_region')
            .select('*');
          if (regionsError) throw regionsError;
          data = regions.map(r => ({
            ...r,
            id: r.id,
            identifier: r.identifier,
            description: r.description,
            dimension_type: 'region' as DimensionType,
            attributes: r.attributes || null,
          }));
          break;
          
        case 'datasource':
          const { data: datasources, error: datasourcesError } = await supabase
            .from('m_u_datasource')
            .select('*');
          if (datasourcesError) throw datasourcesError;
          data = datasources.map(d => ({
            ...d,
            id: d.id,
            identifier: d.identifier,
            description: d.description,
            dimension_type: 'datasource' as DimensionType,
            attributes: d.attributes || null,
          }));
          break;
      }
      
      console.log('Fetched dimensions:', data);
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
      const table = currentType === 'product' ? 'm_u_product' :
                    currentType === 'region' ? 'm_u_region' :
                    'm_u_datasource';
      
      const insertData = {
        identifier: newDimension.id,
        description: newDimension.name,
        dimension_type: currentType,
        ...(currentType === 'product' && { attributes: newDimension.category }),
        ...(currentType === 'region' && { 
          attributes: { country: newDimension.category }
        }),
        ...(currentType === 'datasource' && {
          attributes: {
            datasource_type: newDimension.category,
            system_of_origin: newDimension.systemOrigin
          }
        })
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
      const table = editingDimension.dimension_type === 'product' ? 'm_u_product' :
                    editingDimension.dimension_type === 'region' ? 'm_u_region' :
                    'm_u_datasource';
      
      const updateData = {
        identifier: editingDimension.identifier,
        description: editingDimension.description,
        ...(editingDimension.dimension_type === 'product' && { attributes: editingDimension.attributes }),
        ...(editingDimension.dimension_type === 'region' && { 
          attributes: { country: editingDimension.attributes }
        }),
        ...(editingDimension.dimension_type === 'datasource' && {
          attributes: {
            datasource_type: editingDimension.attributes,
            system_of_origin: editingDimension.system_of_origin
          }
        }),
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
    return dim.identifier?.toLowerCase().includes(searchString) ||
           dim.description?.toLowerCase().includes(searchString);
  });

  const paginatedDimensions = filteredDimensions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDimensions.length / itemsPerPage);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Master Data Management</h2>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/admin/master-data/types')}
        >
          <Database className="h-4 w-4" />
          Manage Types
        </Button>
      </div>
      
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
