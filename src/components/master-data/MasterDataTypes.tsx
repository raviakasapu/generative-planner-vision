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
  });
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchDimensionTypes();
  }, []);

  const fetchDimensionTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('m_u_dimension_types')
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
        .single();

      if (templateError) throw templateError;

      const tableName = `m_u_${newType.name.toLowerCase().replace(/\s+/g, '_')}`;

      // Create the dimension type entry
      const { error: dimensionError } = await supabase
        .from('m_u_dimension_types')
        .insert({
          name: newType.name,
          description: newType.description,
          table_name: tableName,
          attributes: {},
        });

      if (dimensionError) throw dimensionError;

      // Create the actual table using the template structure
      const createTableSQL = generateCreateTableSQL(tableName, templateData.structure);
      const { error: createTableError } = await supabase.rpc('execute_sql', { sql: createTableSQL });

      if (createTableError) throw createTableError;

      toast({
        title: "Success",
        description: "New dimension type and table created successfully",
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

  const generateCreateTableSQL = (tableName: string, structure: any) => {
    // This is a placeholder - in reality, you'd need to implement the SQL generation
    // based on the template structure
    return `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dimension_name VARCHAR NOT NULL DEFAULT '${newType.name}',
        dimension_type VARCHAR NOT NULL DEFAULT '${newType.name.toLowerCase()}',
        identifier VARCHAR NOT NULL,
        description TEXT,
        hierarchy VARCHAR,
        attributes JSONB,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;
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
    </Card>
  );
};

export default MasterDataTypes;