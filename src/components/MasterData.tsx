import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Dimension {
  id: string;
  name: string;
  attributes: string[];
  hierarchy?: string;
}

const MasterData = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [newDimension, setNewDimension] = useState({ id: "", name: "", attributes: [] });
  const { toast } = useToast();

  const handleAddDimension = () => {
    if (!newDimension.id || !newDimension.name) return;
    
    setDimensions(prev => [...prev, { ...newDimension }]);
    setNewDimension({ id: "", name: "", attributes: [] });
    
    toast({
      title: "Dimension added",
      description: `${newDimension.name} has been added successfully.`,
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Master Data Management</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <Button onClick={handleAddDimension}>Add Dimension</Button>
        
        <ScrollArea className="h-[300px] border rounded-md p-4">
          <div className="space-y-2">
            {dimensions.map((dim, i) => (
              <Card key={i} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{dim.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({dim.id})</span>
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