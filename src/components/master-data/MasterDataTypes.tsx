import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DimensionType {
  id: string;
  name: string;
  description: string | null;
  table_name: string;
  attributes: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const MasterDataTypes = () => {
  const [types, setTypes] = useState<DimensionType[]>([]);
  const [newType, setNewType] = useState({
    name: '',
    description: '',
  });
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchDimensionTypes();
  }, []);

  const fetchDimensionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('table_dimension_types')
        .select('*');
      
      if (error) throw error;
      
      const parsedData = (data || []).map(type => ({
        ...type,
        attributes: typeof type.attributes === 'string' 
          ? JSON.parse(type.attributes) 
          : type.attributes || {}
      }));
      
      setTypes(parsedData);
    } catch (error) {
      console.error('Error fetching dimension types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dimension types",
        variant: "destructive",
      });
    }
  };

  const handleAddType = async () => {
    if (!newType.name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // First, get the template structure
      const { data: templateData, error: templateError } = await supabase
        .from('table_template')
        .select('*')
        .eq('template_type', 'master_data')
        .maybeSingle();

      if (templateError) throw templateError;
      if (!templateData) {
        throw new Error('No template found for master data');
      }

      const tableName = `m_u_${newType.name.toLowerCase().replace(/\s+/g, '_')}`;

      // Create the dimension type entry
      const { error: dimensionError } = await supabase
        .from('table_dimension_types')
        .insert({
          name: newType.name,
          description: newType.description,
          table_name: tableName,
          attributes: templateData.structure,
        });

      if (dimensionError) throw dimensionError;

      // Create the table metadata entry
      const { error: metadataError } = await supabase
        .from('table_metadata')
        .insert({
          table_name: tableName,
          table_description: newType.description,
          table_type: 'master_data',
          schema_definition: templateData.structure,
        });

      if (metadataError) throw metadataError;

      toast({
        title: "Success",
        description: "New dimension type created successfully",
      });

      setNewType({ name: '', description: '' });
      fetchDimensionTypes();
    } catch (error) {
      console.error('Error adding dimension type:', error);
      toast({
        title: "Error",
        description: "Failed to add dimension type",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Type Name</Label>
          <Input
            id="name"
            value={newType.name}
            onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter type name"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newType.description}
            onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter description"
          />
        </div>

        <Button 
          onClick={handleAddType}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Add New Type"}
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Existing Types</h3>
        <div className="grid gap-4">
          {types.map((type) => (
            <Card key={type.id} className="p-4">
              <h4 className="font-semibold">{type.name}</h4>
              <p className="text-sm text-gray-600">{type.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};