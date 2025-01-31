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

const MasterDataTypes = () => {
  const [types, setTypes] = useState<DimensionType[]>([]);
  const [newType, setNewType] = useState({
    name: '',
    description: '',
    table_name: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDimensionTypes();
  }, []);

  const fetchDimensionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('m_u_dimension_types')
        .select('*');
      
      if (error) throw error;
      
      // Ensure attributes is parsed as Record<string, any>
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
    if (!newType.name || !newType.table_name) {
      toast({
        title: "Validation Error",
        description: "Name and table name are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('m_u_dimension_types')
        .insert({
          name: newType.name,
          description: newType.description,
          table_name: `m_u_${newType.table_name.toLowerCase()}`,
          attributes: {},
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "New dimension type added successfully",
      });

      setNewType({ name: '', description: '', table_name: '' });
      fetchDimensionTypes();
    } catch (error) {
      console.error('Error adding dimension type:', error);
      toast({
        title: "Error",
        description: "Failed to add dimension type",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Master Data Types Management</h2>
      
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
          
          <div>
            <Label htmlFor="table_name">Table Name (without m_u_ prefix)</Label>
            <Input
              id="table_name"
              value={newType.table_name}
              onChange={(e) => setNewType(prev => ({ ...prev, table_name: e.target.value }))}
              placeholder="Enter table name"
            />
          </div>

          <Button onClick={handleAddType}>Add New Type</Button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Existing Types</h3>
          <div className="grid gap-4">
            {types.map((type) => (
              <Card key={type.id} className="p-4">
                <h4 className="font-semibold">{type.name}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
                <p className="text-sm text-gray-500">Table: {type.table_name}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MasterDataTypes;