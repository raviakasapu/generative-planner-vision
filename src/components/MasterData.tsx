import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Dimension {
  id: string;
  dimension_name: string;
  product_id?: string;
  region_id?: string;
  product_description?: string;
  region_description?: string;
  category?: string;
  country?: string;
  hierarchy_level?: string;
}

const MasterData = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [newDimension, setNewDimension] = useState({ id: "", name: "", type: "product" });
  const { toast } = useToast();

  useEffect(() => {
    fetchDimensions();
  }, []);

  const fetchDimensions = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('masterdimension1')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch regions
      const { data: regions, error: regionsError } = await supabase
        .from('masterdimension2')
        .select('*')
        .order('created_at', { ascending: false });

      if (regionsError) throw regionsError;

      setDimensions([
        ...(products || []).map(p => ({ ...p, dimension_type: 'product' })),
        ...(regions || []).map(r => ({ ...r, dimension_type: 'region' }))
      ]);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dimensions",
        variant: "destructive",
      });
    }
  };

  const handleAddDimension = async () => {
    if (!newDimension.id || !newDimension.name) return;
    
    try {
      const table = newDimension.type === 'product' ? 'masterdimension1' : 'masterdimension2';
      const insertData = newDimension.type === 'product' 
        ? {
            product_id: newDimension.id,
            product_description: newDimension.name,
            dimension_name: 'Products'
          }
        : {
            region_id: newDimension.id,
            region_description: newDimension.name,
            dimension_name: 'Regions'
          };
      
      const { data, error } = await supabase
        .from(table)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setDimensions(prev => [...prev, { ...data, dimension_type: newDimension.type }]);
      setNewDimension({ id: "", name: "", type: "product" });
      
      toast({
        title: "Dimension added",
        description: `${newDimension.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding dimension:', error);
      toast({
        title: "Error",
        description: "Failed to add dimension",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Master Data Management</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dimension ID</label>
            <Input
              value={newDimension.id}
              onChange={(e) => setNewDimension(prev => ({ ...prev, id: e.target.value }))}
              placeholder="Enter dimension ID..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dimension Name</label>
            <Input
              value={newDimension.name}
              onChange={(e) => setNewDimension(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dimension name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={newDimension.type}
              onChange={(e) => setNewDimension(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="product">Product</option>
              <option value="region">Region</option>
            </select>
          </div>
        </div>
        <Button onClick={handleAddDimension}>Add Dimension</Button>
        
        <ScrollArea className="h-[300px] border rounded-md p-4">
          <div className="space-y-2">
            {dimensions.map((dim) => (
              <Card key={dim.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {dim.product_id || dim.region_id}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({dim.product_description || dim.region_description})
                    </span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default MasterData;